import { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import Auth from '../utils/auth';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import { getSavedBookIds, saveBookIds } from '../utils/localStorage';

const SearchBooks = () => {
  const [saveBookMutation] = useMutation(SAVE_BOOK);
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  const searchGoogleBooks = async (query) => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data from Google Books API');
      }
      const data = await response.json();
      return data.items; 
    } catch (error) {
      console.error('Error searching Google Books API:', error);
      return [];
    }
  };

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  }, [savedBookIds]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

  
    try {
      const searchResults = await searchGoogleBooks(searchInput);
      setSearchedBooks(searchResults);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    const token = Auth.loggedIn() ? Auth.getToken() : null;
  
    if (!token) {
      return false;
    }
  
    try {
      const { data } = await saveBookMutation({
        variables: { input: bookToSave },
      });
  
      setSavedBookIds((prevSavedBookIds) => [...prevSavedBookIds, data.saveBook.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
        {searchedBooks.map((book) => {
  return (
    <Col md="4" key={book.id}>
      <Card border='dark'>
        {book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail ? (
          <Card.Img src={book.volumeInfo.imageLinks.thumbnail} alt={`The cover for ${book.volumeInfo.title}`} variant='top' />
        ) : null}
        <Card.Body>
          <Card.Title>{book.volumeInfo.title}</Card.Title>
          <p className='small'>Authors: {book.volumeInfo.authors}</p>
          <Card.Text>{book.volumeInfo.description}</Card.Text>
          {Auth.loggedIn() && (
            <Button
              disabled={savedBookIds?.some((savedBookId) => savedBookId === book.id)}
              className='btn-block btn-info'
              onClick={() => handleSaveBook(book.id)}>
              {savedBookIds?.some((savedBookId) => savedBookId === book.id)
                ? 'This book has already been saved!'
                : 'Save this Book!'}
            </Button>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
})}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
