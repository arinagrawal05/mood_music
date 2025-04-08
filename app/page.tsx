import { MoodForm } from "@/components/mood-form"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Dashboard } from "@/components/dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl mb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mood Music</h1>
        <ThemeToggle />
      </div>

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="mood">Mood Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="mt-0">
          <Dashboard />
        </TabsContent>

        <TabsContent value="search" className="mt-0">
          <SearchBar />
        </TabsContent>

        <TabsContent value="mood" className="mt-0">
          <p className="text-muted-foreground mb-8">
            Enter a mood or vibe and we'll suggest songs with available previews that match it.
          </p>
          <MoodForm />
        </TabsContent>
      </Tabs>
    </main>
  )
}
