'use client'

import { Card, CardContent } from "@/components/ui/card"
import { UnsplashPhoto } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Download, X, ZoomIn } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Masonry from 'react-masonry-css'
import InfiniteScroll from 'react-infinite-scroll-component'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Breakpoints para o Masonry
const breakpointColumnsObj = {
  default: 4,
  1536: 4,
  1280: 3,
  1024: 3,
  768: 2,
  640: 1
};

export function PhotoGrid() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query')
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<UnsplashPhoto | null>(null)
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set())

  const loadPhotos = useCallback(async (reset = false) => {
    try {
      setLoading(true)
      const currentPage = reset ? 1 : page
      const response = await fetch(`/api/photos?page=${currentPage}&query=${query || ''}`)
      
      if (!response.ok) {
        throw new Error('Falha ao carregar as fotos')
      }

      const { data, totalPages } = await response.json()
      
      if (!data) {
        throw new Error('Dados inválidos recebidos do servidor')
      }

      setPhotos(prev => reset ? data : [...prev, ...data])
      setHasMore(totalPages ? currentPage < totalPages : true)
      if (!reset) setPage(p => p + 1)
      setError(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar fotos')
      console.error('Failed to load photos:', error)
    } finally {
      setLoading(false)
    }
  }, [page, query])

  useEffect(() => {
    setLoading(true)
    setPage(1)
    setPhotos([])
    setError(null)
    loadPhotos(true)
  }, [query, loadPhotos])

  const handleLike = (photoId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setLikedPhotos(prev => {
      const newLiked = new Set(prev)
      if (newLiked.has(photoId)) {
        newLiked.delete(photoId)
      } else {
        newLiked.add(photoId)
      }
      return newLiked
    })
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (loading && photos.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse space-y-3">
          <div className="h-2.5 w-32 bg-gray-300 rounded-full" />
          <div className="h-2 w-24 bg-gray-300 rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <>
      <InfiniteScroll
        dataLength={photos.length}
        next={() => loadPhotos()}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center py-4">
            <div className="animate-pulse space-y-3">
              <div className="h-2.5 w-32 bg-gray-300 rounded-full" />
              <div className="h-2 w-24 bg-gray-300 rounded-full" />
            </div>
          </div>
        }
        endMessage={
          <p className="text-center text-gray-500 py-4">
            Não há mais imagens para carregar.
          </p>
        }
      >
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index % 3 * 0.1 }}
              className="mb-4"
            >
              <Card 
                className="group relative overflow-hidden cursor-pointer bg-black/5 dark:bg-white/5 backdrop-blur-sm"
                onClick={() => setSelectedPhoto(photo)}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <Image
                      src={photo.urls.small}
                      alt={photo.alt_description || 'Unsplash photo'}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-[2px]"
                      loading="lazy"
                      quality={75}
                    />
                    
                    {/* Overlay com efeito de vidro */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    
                    {/* Ícone de zoom no centro */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <ZoomIn className="w-10 h-10 text-white" />
                    </div>

                    {/* Botão de like com animação */}
                    <motion.button
                      whileTap={{ scale: 1.4 }}
                      onClick={(e) => handleLike(photo.id, e)}
                      className={cn(
                        "absolute top-4 right-4 p-2 rounded-full transition-all",
                        "bg-white/10 backdrop-blur-md hover:bg-white/20",
                        "opacity-0 group-hover:opacity-100 z-10",
                        likedPhotos.has(photo.id) && "text-red-500"
                      )}
                    >
                      <Heart className={cn(
                        "w-5 h-5",
                        likedPhotos.has(photo.id) && "fill-current"
                      )} />
                    </motion.button>

                    {/* Informações com efeito de slide */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-sm font-medium text-white">{photo.user.name}</p>
                      <p className="text-sm text-white/80">
                        {photo.likes + (likedPhotos.has(photo.id) ? 1 : 0)} curtidas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Masonry>
      </InfiniteScroll>

      {/* Modal com animações */}
      <AnimatePresence>
        {selectedPhoto && (
          <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
            <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {selectedPhoto && (
                  <div className="grid md:grid-cols-[2fr,1fr] h-full">
                    {/* Imagem */}
                    <div className="relative h-[40vh] md:h-full">
                      <Image
                        src={selectedPhoto.urls.regular}
                        alt={selectedPhoto.alt_description || 'Unsplash photo'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 66vw"
                        quality={90}
                        priority
                      />
                      {/* Botão de fechar */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full bg-black/20 hover:bg-black/40 text-white"
                        onClick={() => setSelectedPhoto(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Detalhes */}
                    <div className="p-6 overflow-y-auto">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{selectedPhoto.user.name}</h3>
                            <p className="text-sm text-muted-foreground">@{selectedPhoto.user.username}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "rounded-full",
                              likedPhotos.has(selectedPhoto.id) && "text-red-500"
                            )}
                            onClick={(e) => handleLike(selectedPhoto.id, e)}
                          >
                            <Heart className={cn(
                              "h-5 w-5",
                              likedPhotos.has(selectedPhoto.id) && "fill-current"
                            )} />
                          </Button>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" className="flex-1">
                            <Share2 className="mr-2 h-4 w-4" />
                            Compartilhar
                          </Button>
                          <Button variant="secondary" size="sm" className="flex-1">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Detalhes</h4>
                          <dl className="space-y-2 text-sm">
                            <div>
                              <dt className="text-muted-foreground">Curtidas</dt>
                              <dd>{selectedPhoto.likes + (likedPhotos.has(selectedPhoto.id) ? 1 : 0)}</dd>
                            </div>
                            {selectedPhoto.alt_description && (
                              <div>
                                <dt className="text-muted-foreground">Descrição</dt>
                                <dd>{selectedPhoto.alt_description}</dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
} 