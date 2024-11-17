'use client'

import { Suspense } from 'react'
import { PhotoGrid } from '@/components/photo-grid'

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <Suspense fallback={<div>Carregando...</div>}>
        <PhotoGrid />
      </Suspense>
    </main>
  )
}
