(() => {
  const box = document.getElementById('online-viewers');
  const label = document.getElementById('online-label');
  if (!box || !label) return;
  const unavailable = () => {
    box.dataset.state = 'offline';
    label.textContent = 'מונה הגולשים אינו זמין כרגע';
  };
  if (!window.supabase) { unavailable(); return; }
  // Random browser identifier only; no names, email addresses or browsing history.
  let visitor = crypto.randomUUID();
  try {
    const saved = localStorage.getItem('dreamwave-presence-id');
    if (saved && /^[a-f0-9-]{36}$/.test(saved)) visitor = saved;
    else localStorage.setItem('dreamwave-presence-id', visitor);
  } catch (_) { /* Storage may be disabled; count this tab separately. */ }
  const client = window.supabase.createClient(
    'https://dqglnpnwvsljpgoddozi.supabase.co',
    'sb_publishable_ThsPwA5sMisCtzhB85pdpw_UcRcZ1DQ',
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
  );
  const channel = client.channel('dreamwave-online-v1', {
    config: { presence: { key: visitor } }
  });
  let connected = false;
  const connectionTimeout = setTimeout(() => { if (!connected) unavailable(); }, 15000);
  let revision = 0;
  let pending = Promise.resolve();
  const render = () => {
    if (!connected) return;
    const count = Object.values(channel.presenceState()).filter(entries => entries.length > 0).length;
    box.dataset.state = 'live';
    label.textContent = 'גולשים באתר עכשיו: ' + count.toLocaleString('he-IL');
  };
  const updatePresence = () => {
    const version = ++revision;
    pending = pending.catch(() => {}).then(async () => {
      if (!connected || version !== revision) return;
      const result = document.visibilityState === 'visible'
        ? await channel.track({ online: true })
        : await channel.untrack();
      if (version !== revision || !connected) return;
      if (result !== 'ok') unavailable();
      else render();
    }).catch(unavailable);
  };
  channel.on('presence', { event: 'sync' }, render).subscribe(status => {
    connected = status === 'SUBSCRIBED';
    if (connected) { clearTimeout(connectionTimeout); updatePresence(); }
    else if (['CHANNEL_ERROR', 'TIMED_OUT', 'CLOSED'].includes(status)) unavailable();
  });
  document.addEventListener('visibilitychange', updatePresence);
  window.addEventListener('offline', () => { connected = false; unavailable(); });
  window.addEventListener('online', () => {
    if (!connected) { box.dataset.state = 'loading'; label.textContent = 'מתחבר למונה הגולשים…'; }
  });
  window.addEventListener('pagehide', () => { channel.untrack(); });
  window.addEventListener('pageshow', updatePresence);
})();
