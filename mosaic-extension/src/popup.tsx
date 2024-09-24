import { useFeatureToggle } from "./hooks/useFeatureToggle"
import { useUser } from "./hooks/useUser"

export default function IndexPopup() {
  const { user } = useUser()
  const { active, toggle } = useFeatureToggle()
  return (
    <div>
      Hello World! {user?.email}
      <div>active {active ? "true" : "false"}</div>
      <button onClick={toggle}>Toggle </button>
    </div>
  )
}
