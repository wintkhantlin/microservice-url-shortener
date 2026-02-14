import { createLazyFileRoute } from '@tanstack/react-router'
import { Register } from './-register'

export const Route = createLazyFileRoute('/auth/register')({
  component: Register,
})
