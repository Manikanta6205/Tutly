import type { Notes, NoteCategory } from "@prisma/client";
import { BookOpen, FileQuestion, ScrollText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import MarkdownPreview from "@/components/MarkdownPreview";

interface CausedObjects {
  courseId: string;
  classId: string;
}

const getNoteDetails = (category: NoteCategory, objectId: string, causedObjects: CausedObjects) => {
  const config = {
    "ASSIGNMENT": {
      icon: ScrollText,
      href: `/assignments/${objectId}`,
      style: "text-yellow-500",
      label: "Assignment"
    },
    "CLASS": {
      icon: BookOpen,
      href: `/courses/${causedObjects?.courseId}/classes/${objectId}`,
      style: "text-blue-500", 
      label: "Class"
    },
    "DOUBT": {
      icon: FileQuestion,
      href: `/doubts/${objectId}`,
      style: "text-green-500",
      label: "Doubt"
    }
  };

  return config[category];
};

const NotesComponent = ({
  notes,
}: {
  notes: Notes[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const categories = ["ALL", ...new Set(notes.map(n => n.category))];
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => note.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xl"
        />
        
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTags.includes(tag)
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="ALL" className="w-full">
        <TabsList className="flex justify-center">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="flex-1">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 gap-4">
              {filteredNotes
                .filter(note => category === "ALL" || note.category === category)
                .map((note) => {
                  const details = getNoteDetails(note.category, note.objectId, note.causedObjects as unknown as CausedObjects);
                  const Icon = details.icon;
                  
                  return (
                    <Card key={note.id}>
                      <CardHeader className="flex flex-row items-center gap-4 py-3">
                        <div className={`p-1.5 rounded-full bg-muted ${details.style}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-sm">{details.label}</CardTitle>
                          <CardDescription className="text-xs">
                            {formatDistanceToNow(note.createdAt, { addSuffix: true })}
                          </CardDescription>
                          <a 
                            href={details.href}
                            className="text-xs text-muted-foreground hover:text-primary transition-colors ml-auto"
                          >
                            View
                          </a>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 py-2">
                        <div className="prose dark:prose-invert max-w-none">
                          <MarkdownPreview
                            content={note.description || ""}
                            className="text-sm"
                          />
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {note.tags.map(tag => (
                            <span 
                              key={tag}
                              className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default NotesComponent;