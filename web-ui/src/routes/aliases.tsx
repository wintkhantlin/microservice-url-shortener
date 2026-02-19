import { createFileRoute } from '@tanstack/react-router'
import { aliasesQueryOptions } from '@/hooks/useAliases'

export const Route = createFileRoute('/aliases')({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(aliasesQueryOptions())
})
