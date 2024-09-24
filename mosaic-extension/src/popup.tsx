import { useUser } from "./hooks/useUser"

export default function IndexPopup() {
  const { user } = useUser()
  return <div>Hello World! {user?.email}</div>
}
