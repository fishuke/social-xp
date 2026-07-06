// Social XP service worker - daily-reminder push notifications only.
// Kept deliberately minimal; no offline caching (see roadmap for Serwist later).

self.addEventListener("push", function (event) {
  if (!event.data) return;
  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: "Social XP", body: event.data.text() };
  }
  const title = data.title || "Social XP";
  const options = {
    body: data.body || "Time for today's 3-minute rep.",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [80, 40, 80],
    tag: data.tag || "daily-reminder", // collapse repeats into one
    renotify: true,
    data: { url: data.url || "/learn" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/learn";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      // Focus an already-open tab if we have one, else open a new window.
      for (const client of clients) {
        if ("focus" in client) {
          client.navigate(target);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});
