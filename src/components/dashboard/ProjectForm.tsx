'use client'

import { useState, useEffect } from "react"
import type { Project } from "../../utils/taskUtils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type ProjectFormProps = {
  onSubmit: (project: Project) => void
  initialProject?: Project | null
  onCancel: () => void
}

export function ProjectForm({ onSubmit, initialProject, onCancel }: ProjectFormProps) {
  const [project, setProject] = useState<Project>({
    id: "",
    name: "",
    description: "",
  })

  useEffect(() => {
    if (initialProject) {
      setProject(initialProject)
    }
  }, [initialProject])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...project,
      id: project.id || `project-${Date.now()}`,
    })
    setProject({
      id: "",
      name: "",
      description: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          value={project.name}
          onChange={(e) => setProject({ ...project, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={project.description}
          onChange={(e) => setProject({ ...project, description: e.target.value })}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialProject ? "Update Project" : "Add Project"}</Button>
      </div>
    </form>
  )
}

