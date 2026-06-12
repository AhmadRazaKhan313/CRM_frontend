import { useEffect, useRef, useState } from "react"
import { Bell, Search, Settings, Check, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"
import useNotificationStore from "../../store/notificationStore"

const typeIcons = {
  lead_assigned:   { icon: "lucide:user-plus",     color: "text-blue-500",   bg: "bg-blue-50" },
  lead_converted:  { icon: "lucide:check-circle",  color: "text-green-500",  bg: "bg-green-50" },
  task_assigned:   { icon: "lucide:clipboard-list", color: "text-purple-500", bg: "bg-purple-50" },
  task_due:        { icon: "lucide:clock",          color: "text-red-500",    bg: "bg-red-50" },
  client_assigned: { icon: "lucide:handshake",      color: "text-teal-500",   bg: "bg-teal-50" },
  leave_approved:  { icon: "lucide:calendar-check", color: "text-green-500",  bg: "bg-green-50" },
  leave_rejected:  { icon: "lucide:calendar-x",     color: "text-red-500",    bg: "bg-red-50" },
  report_reviewed: { icon: "lucide:file-text",      color: "text-orange-500", bg: "bg-orange-50" },
  general:         { icon: "lucide:bell",            color: "text-gray-500",   bg: "bg-gray-100" },
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function Topbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const {
    notifications, unreadCount,
    fetch, markRead, markAllRead, remove,
  } = useNotificationStore()

  // Poll every 30 seconds for new notifications
  useEffect(() => {
    fetch()
    const interval = setInterval(fetch, 30000)
    return () => clearInterval(interval)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleClick = async (notif) => {
    if (!notif.is_read) await markRead(notif.id)
    if (notif.link) {
      navigate(notif.link)
      setOpen(false)
    }
  }

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-2 text-gray-800">
        <span className="text-sm font-medium">Dashboard</span>
      </div>

      <div className="flex items-center gap-2">
        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
          <Search className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-red-100 text-red-600 font-semibold px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <div className="py-12 text-center">
                    <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No notifications</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const config = typeIcons[notif.type] || typeIcons.general
                    return (
                      <div
                        key={notif.id}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group ${
                          !notif.is_read ? "bg-blue-50/30" : ""
                        }`}
                        onClick={() => handleClick(notif)}
                      >
                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-xl ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Icon icon={config.icon} className={`w-4 h-4 ${config.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium text-gray-800 leading-tight ${!notif.is_read ? "font-semibold" : ""}`}>
                            {notif.title}
                          </p>
                          {notif.message && (
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-tight">
                              {notif.message}
                            </p>
                          )}
                          <p className="text-[10px] text-gray-400 mt-1">{timeAgo(notif.created_at)}</p>
                        </div>

                        {/* Unread dot + delete */}
                        <div className="flex flex-col items-center gap-1.5 shrink-0">
                          {!notif.is_read && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); remove(notif.id) }}
                            className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center text-gray-300 hover:text-red-400 transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
