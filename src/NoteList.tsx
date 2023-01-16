import React, { useMemo, useState } from 'react'
import { Badge, Button, Card, Col, Form, Modal, Row, Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ReactSelect from 'react-select'
import { Note, Tag } from './App'
import styles from './NoteList.module.css'

type NoteListProps = {
    availableTags: Tag[],
    notes: Note[],
    deleteTag: (id: string) => void
    updateTag: (id: string, label: string) => void
}

type SimplifiedNote = {
    id: string,
    title: string,
    tags: Tag[],
}
type EditTagsModalProps ={
    availableTags: Tag[]
    show: boolean
    handleClose: () => void;
    deleteTag: (id: string) => void
    updateTag: (id: string, label: string) => void
}
const NoteList = ({ availableTags, notes, updateTag,deleteTag }: NoteListProps) => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [title, setTitle] = useState("");
    const [show, setShow] = useState<boolean>(false);
    const handleClose = () => {
        setShow(false);
    }
    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (title === '' || note.title.toLowerCase().includes(title.toLowerCase()))
                && (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(notetag => notetag.id === tag.id)))
        })
    }, [title, selectedTags, notes]);
    return (
        <>
            <Row>
                <Col><h1>Notes</h1></Col>
                <Col xs='auto' >
                    <Stack gap={2} direction='horizontal'>
                        <Link to='/new'>
                            <Button>Create</Button>
                        </Link>
                        <Button onClick={() =>  setShow(true)} variant='outline-secondary'>Edit Tags</Button>
                    </Stack>
                </Col>
            </Row>
            <Form>
                <Row className='mb-4'>
                    <Col>
                        <Form.Group>
                            <Form.Label>
                                Title
                            </Form.Label>
                            <Form.Control onChange={(e) => setTitle(e.target.value)} required />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='tags'>
                            <Form.Label>
                                Tags
                            </Form.Label>
                            <ReactSelect
                                value={selectedTags.map(tag => {
                                    return {
                                        label: tag.label,
                                        value: tag.id,
                                    }
                                })}
                                options={availableTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                onChange={tags => {
                                    setSelectedTags(tags.map(tag => {
                                        return { label: tag.label, id: tag.value }
                                    }))
                                }}
                                isMulti />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <Row xs={1} sm={2} lg={3} xl={4} className='g-3'>
                {
                    filteredNotes.map(note => (
                        <Col key={note.id}>
                            <NoteCard key={note.id} id={note.id} title={note.title} tags={note.tags} />
                        </Col>
                    ))
                }
            </Row>
            <EditTagsModal 
                show={show} 
                handleClose={handleClose} 
                deleteTag={deleteTag}
                updateTag={updateTag} 
                availableTags={availableTags}
            />
        </>
    )
}

function NoteCard({ id, tags, title }: SimplifiedNote) {
    return <Card as={Link} to={`/${id}`} className={`h-100 text-reset text-decoration-none ${styles.card}`}>
        <Card.Body>
            <Stack gap={3} className='align-item-center justify-content-center h-100'>
                <span>{title}</span>
                {tags.length > 0 && (
                    <Stack gap={2} direction='horizontal' className='justify-content-center flex-wrap'>
                        {tags.map(tag => (
                            <Badge key={tag.id}>{tag.label}</Badge>
                        ))}
                    </Stack>
                )}
            </Stack>
        </Card.Body>
    </Card>
}

function EditTagsModal({availableTags,show,handleClose,deleteTag,updateTag}: EditTagsModalProps ){
    return <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Edit Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Stack gap={2}>
                    {
                        availableTags.map(tag => (
                            <Row key={tag.id}>
                                <Col>
                                    <Form.Control type='text' value={tag.label} onChange={(e) => updateTag(tag.id,e.target.value)}/>
                                </Col>
                                <Col xs='auto' >    
                                    <Button variant='outline-danger' onClick={() => deleteTag(tag.id)}>&times;</Button>
                                </Col>
                            </Row>
                        ))
                    }
                </Stack>
            </Form>
        </Modal.Body>
    </Modal>
}

export default NoteList