'use client'

import { Suspense } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Home, Compass, Menu, Bell, Plus } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get('query') || '')

  const updateQuery = (query: string) => {
    const params = new URLSearchParams(searchParams)
    if (query) {
      params.set('query', query)
    } else {
      params.delete('query')
    }
    router.push(`/?${params.toString()}`)
  }

  useEffect(() => {
    setSearchValue(searchParams.get('query') || '')
  }, [searchParams])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar imagens..."
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value)
          updateQuery(e.target.value)
        }}
        className="w-full pl-10 pr-4"
      />
    </div>
  )
}

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo e navegação principal */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">ImageGallery</span>
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <Home className="mr-2 h-4 w-4" />
              Início
            </Link>
            <Link 
              href="/explore"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <Compass className="mr-2 h-4 w-4" />
              Explorar
            </Link>
          </nav>
        </div>

        {/* Barra de pesquisa central */}
        <div className="flex-1 max-w-xl hidden md:block">
          <Suspense fallback={<div>Carregando...</div>}>
            <SearchInput />
          </Suspense>
        </div>

        {/* Ações e perfil */}
        <div className="flex items-center gap-4">
          {/* Botão de pesquisa mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Botões de ação */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Plus className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
          </div>

          {/* Menu do usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">shadcn</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    m@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem>
                Minhas coleções
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menu mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4">
                <Link 
                  href="/"
                  className="flex items-center text-sm font-medium"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Início
                </Link>
                <Link 
                  href="/explore"
                  className="flex items-center text-sm font-medium"
                >
                  <Compass className="mr-2 h-4 w-4" />
                  Explorar
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Barra de pesquisa mobile */}
      {isSearchOpen && (
        <div className="border-t md:hidden">
          <div className="container py-4">
            <Suspense fallback={<div>Carregando...</div>}>
              <SearchInput />
            </Suspense>
          </div>
        </div>
      )}
    </header>
  )
} 