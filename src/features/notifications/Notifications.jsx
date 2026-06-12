import { useEffect } from "react"
import { Bell, Check, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"
import useNotificationStore from "../../store/notificationStore"

const typeIcons = {
  lead_assigned:   { icon: "lucide:user-plus",      color: "text-blue-500",   bg: "bg-blue-50" },
  lead_converted:  { icon: "lucide:check-circle",   color: "text-green-500",  bg: "bg-green-50" },
  task_assigned:   { icon: "lucide:clipboard-list", color: "text-purple-500", bg: "bg-purple-50" },
  task_due:        { icon: "lucide:clock",           color: "text-red-500",    bg: "bg-red-50" },
  client_assigned: { icon: "lucide:handshake",       color: "text-teal-500",   bg: "bg-teal-50" },
  leave_approved:  { icon: "lucide:calendar-check",  color: "text-green-500",  bg: "bg-green-50" },
  leave_rejected:  { icon: "lucide:calendar-x",      color: "text-red-500",    bg: "bg-red-50" },
  report_reviewed: { icon: "lucide:file-text",       color: "text-orange-500", bg: "bg-orange-50" },
  general:         { icon: "lucide:bell",             color: "text-gray-500",   bg: "bg-gray-100" },
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

export default function Notifications() {
  const navigate = useNavigate()
  const { notifications, loading, unreadCount, fetch, markRead, markAllRead, remove } = useNotificationStore()

  useEffect(() => { fetch() }, [])

  const handleClick = async (notif) => {
    if (!notif.is_read) await markRead(notif.id)
    if (notif.link) navigate(notif.link)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Activity</p>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">No notifications</p>
            <p className="text-xs text-gray-400 mt-1">You are all caught up</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map((notif) => {
              const config = typeIcons[notif.type] || typeIcons.general
              return (
                <div
                  key={notif.id}
                  onClick={() => handleClick(notif)}
                  className={`flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer group ${
                    !notif.is_read ? "bg-blue-50/20" : ""
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                    <Icon icon={config.icon} className={`w-5 h-5 ${config.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm text-gray-800 leading-snug ${!notif.is_read ? "font-semibold" : "font-medium"}`}>
                      {notif.title}
                    </p>
                    {notif.message && (
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(notif.created_at)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!notif.is_read && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); remove(notif.id) }}
                      className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
