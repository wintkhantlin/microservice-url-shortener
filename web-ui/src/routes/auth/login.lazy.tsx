import { createLazyFileRoute } from '@tanstack/react-router'
import { Login } from './-login'

export const Route = createLazyFileRoute('/auth/login')({
  component: Login,
})
