import React from 'react'
import { useNote } from './NoteLayout'
import { Badge, Button, Col, Row, Stack } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

type NoteProps ={
    onDeleteNote: (id: string) => void
}

const Note = ({onDeleteNote}: NoteProps) => {
    const note = useNote();
    const navigate =  useNavigate();
    return <>
        <Row className='align-items-center mb-4'>
            <Col>
                <h1>{note.title}</h1>
                {
                    note.tags.length > 0 && (
                        <Stack gap={2} direction='horizontal' className='flex-wrap'>
                            {note.tags.map(tag => (
                                <Badge key={tag.id}>{tag.label}</Badge>
                            ))}
                        </Stack>
                    )}
            </Col>
            <Col xs='auto'>
                <Stack direction='horizontal' gap={2}>
                    <Link to={`/${note.id}/edit`}>
                        <Button >Edit</Button>
                    </Link>
                    <Button variant='danger' onClick={() => {
                        onDeleteNote(note.id)
                        navigate('/');
                        }}>Delete</Button>
                    <Link to='..'>
                        <Button variant='outline-secondary'>Back</Button>
                    </Link>
                </Stack>
            </Col>
        </Row>
        <ReactMarkdown>
            {note.markdown}
        </ReactMarkdown>
    </>
}

export default Note