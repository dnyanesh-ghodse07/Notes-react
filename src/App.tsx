import "bootstrap/dist/css/bootstrap.min.css"
import { Container, NavProps } from "react-bootstrap"
import { Navigate, Route, Routes } from "react-router-dom"
import NewNote from "./NewNote"
import { useLocalStorage } from "./useLocalStorage"
import { useMemo } from "react"
import {v4 as uuidV4} from 'uuid';
import NoteList from "./NoteList"
import NoteLayout from "./NoteLayout"
import Note from "./Note"
import EditNote from "./EditNote"

export type Note = {
  id: string
} & NoteData

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string,
  markdown: string,
  tagsIds: string[]
}

export type Tag = {
  id: string
  label: string
}

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const noteWithTags = useMemo(() => {
    return notes.map(note => {
      return {...note, tags: tags.filter(tag => note.tagsIds.includes(tag.id))}
    })
  }, [notes, tags]);

  function onCreateNote({tags,...data}: NoteData){
    setNotes(prevNotes => {
      return [
        ...prevNotes, {...data, id: uuidV4(), tagsIds: tags.map(tag => tag.id)}
      ]
    })
  } 

  function addTag(tag: Tag){
    setTags(prev => [...prev, tag])
  }

  function onUpdateNote(id: string,{tags,...data}: NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if(note.id === id){
          return {...note,...data, tagsIds: tags.map(tag => tag.id)}
        }else{
          return note
        }
      })
    })
  }

  function updateTag(id: string, label: string){
    setTags(prevTags => {
      return prevTags.map(tag => {
        if(tag.id == id){
          return {...tag, label}
        }else{
          return tag;
        }
      })
    })
  }

  function deleteTag (id: string){
    setTags(prevTags => prevTags.filter(tag => tag.id !== id));
  }

  function onDeleteNote(id:string){
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  }


  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<NoteList notes={noteWithTags} availableTags={tags} deleteTag={deleteTag} updateTag={updateTag}/>}  />
        <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags}/>} />
        <Route path="/:id" element={<NoteLayout notes={noteWithTags}/>}>
          <Route index element={<Note onDeleteNote={onDeleteNote} />} />
          <Route path="edit" element={<EditNote onSubmit={onUpdateNote} onAddTag={addTag} availableTags={tags}/>} />
        </Route>
        <Route path="*" element={<Navigate to='/' />} />
      </Routes>
    </Container>
  )
}

export default App
