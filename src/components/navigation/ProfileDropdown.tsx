import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { useProfileStore } from '@/stores/profile.store'
import { useState, useEffect } from 'react'
import { 
  LogOut, 
  Settings, 
  UserCircle, 
  Package, 
  CreditCard, 
  Home,
  ChevronDown, 
  Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ProfileDropdownProps {
  isAdmin: boolean
}

export function ProfileDropdown({ isAdmin }: ProfileDropdownProps) {
  const { user, logout } = useAuthStore()
  const { notifications, fetchNotifications } = useProfileStore()
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0)

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications().then(() => {
      const unreadCount = notifications.filter(n => !n.isRead).length
      setUnreadNotificationsCount(unreadCount)
    })
  }, [fetchNotifications, notifications])

  // Get first name from full name
  const firstName = user?.name ? user.name.split(' ')[0] : ''
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user?.name) return 'U'
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" aria-label="Notifications" asChild className="hover:bg-blue-50 relative">
        <Link to="/profile/notifications">
          <Bell className="h-5 w-5 text-blue-500" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </span>
          )}
        </Link>
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5 p-1 pl-1 pr-2 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Avatar className="h-8 w-8 border-2 border-primary/10">
              <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-medium text-sm">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start -space-y-0.5">
              <span className="font-medium text-sm">{firstName}</span>
              <span className="text-xs text-muted-foreground/80">Account</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 bg-white shadow-xl backdrop-blur-lg border border-gray-200/80" align="end" forceMount>
          <DropdownMenuLabel className="font-normal px-4 py-3 border-b border-gray-100">
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <div className="py-2">
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="py-2.5">
                <Link to="/profile" className="flex w-full cursor-pointer items-center hover:bg-gray-50">
                  <UserCircle className="mr-2 h-4 w-4 text-indigo-600" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="py-2.5">
                <Link to="/profile/orders" className="flex w-full cursor-pointer items-center hover:bg-gray-50">
                  <Package className="mr-2 h-4 w-4 text-blue-600" />
                  <span>My Orders</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="py-2.5">
                <Link to="/profile/addresses" className="flex w-full cursor-pointer items-center hover:bg-gray-50">
                  <Home className="mr-2 h-4 w-4 text-sky-600" />
                  <span>My Addresses</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="py-2.5">
                <Link to="/profile/payment-methods" className="flex w-full cursor-pointer items-center hover:bg-gray-50">
                  <CreditCard className="mr-2 h-4 w-4 text-purple-600" />
                  <span>Payment Methods</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="py-2.5">
                <Link to="/profile/settings" className="flex w-full cursor-pointer items-center hover:bg-gray-50">
                  <Settings className="mr-2 h-4 w-4 text-gray-600" />
                  <span>Account Settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </div>
          {isAdmin && (
            <>
              <DropdownMenuSeparator className="mb-1 mt-1"/>
              <DropdownMenuItem asChild className="py-2.5">
                <Link to="/admin" className="flex w-full cursor-pointer items-center text-primary hover:bg-gray-50">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator className="mb-1 mt-1"/>
          <DropdownMenuItem onClick={() => logout()} className="text-red-600 cursor-pointer hover:bg-red-50 py-2.5">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 