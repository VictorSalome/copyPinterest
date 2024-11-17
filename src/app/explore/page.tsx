'use client'

import { Card, CardContent } from "@/components/ui/card"
import { categories } from "@/lib/constants"
import Link from "next/link"
import { motion } from "framer-motion"
import { useRef } from "react"

export default function ExplorePage() {
  const constraintsRef = useRef(null)

  const additionalCategories = [
    {
      name: "Arquitetura",
      slug: "architecture-photos", 
      description: "Designs impressionantes e estruturas marcantes",
      image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2"
    },
    {
      name: "Gastronomia", 
      slug: "food",
      description: "Deliciosas criações culinárias e fotografia de alimentos",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
    },
    {
      name: "Tecnologia",
      slug: "technology", 
      description: "Inovação e avanços tecnológicos em foco",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
    },
    {
      name: "Esportes",
      slug: "sports",
      description: "Momentos emocionantes do mundo esportivo",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211" 
    },
    {
      name: "Vida Selvagem",
      slug: "wildlife",
      description: "A beleza da natureza e dos animais em seu habitat",
      image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7"
    },
    {
      name: "Anime",
      slug: "anime", 
      description: "Fotografia de anime e mangás",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477"
    }
  ]

  const allCategories = [...categories, ...additionalCategories]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="container py-10 mx-auto"
    >
      <div className="space-y-12">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Descubra Novas Inspirações
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore nossa coleção exclusiva de imagens cuidadosamente selecionadas para despertar sua criatividade e imaginação
          </p>
        </motion.div>

        <motion.div
          ref={constraintsRef}
          className="overflow-hidden rounded-xl"
        >
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {allCategories.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.03, 
                  transition: { duration: 0.2 },
                }}
                className="group"
              >
                <Link
                  href={`/?query=${category.slug}`}
                  className="block"
                >
                  <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <CardContent className="p-0 relative aspect-[4/3]">
                      <motion.img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                      <motion.div
                        className="absolute bottom-0 left-0 p-6 w-full"
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                          {category.name}
                        </h2>
                        <p className="text-md text-white/90 group-hover:text-white transition-colors duration-300">
                          {category.description}
                        </p>
                      </motion.div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}