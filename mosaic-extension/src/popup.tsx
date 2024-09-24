import { useFeatureToggle } from "./hooks/useFeatureToggle"
import { useUser } from "./hooks/useUser"

export default function IndexPopup() {
  const { user } = useUser()
  const { active, toggle } = useFeatureToggle()

  if (user === null)
    return (
      <div>
        <button
          onClick={() => {
            window.open("options.html", "_blank")
          }}>
          Login
        </button>
      </div>
    )

  return (
    <div>
      Hello World! {user?.email}
      <div>active {active ? "true" : "false"}</div>
      <button onClick={toggle}>Toggle </button>
    </div>
  )
}
