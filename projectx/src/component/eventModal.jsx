import React, { useState, useEffect } from 'react';
import { deleteEvent, updateEvent } from '../api/event';
import {createComment,getComment} from '../api/comment'
import { FaStar } from "react-icons/fa";
import '../Style/show.css';
import { useCommentContext } from './comment';

const Show = React.forwardRef((props, ref) => {
  const { content, setContent } = useCommentContext();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  

  const handleAddComment = async (event) => {
    event.preventDefault();
    if (newComment.trim() === '') {
      return;
    }
  
    try {
      // Create new comment
      await createComment(props.details._id, props.user.user._id, newComment, props.user.user.userName);
  
      // Update comments state by adding the new comment
      setComments((prevComments) => [
        ...prevComments,
        { userName: props.user.user.userName, content: [newComment] },
      ]);
  
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      // Handle error (e.g., show a message to the user)
    }
  };
  
  useEffect(() => {
    const fetchComments = async () => {
      if (props.details && Array.isArray(props.details.comments) && props.details.comments.length > 0) {
        const commentsData = [];
        for (const commentId of props.details.comments) {
          try {
            const comment = await getComment(commentId);
            commentsData.push(comment);
          } catch (error) {
            console.error(`Error fetching comment ${commentId} for event ${props.details._id}:`, error);
            // Handle error (e.g., show a message to the user)
          }
        }
        setComments(commentsData.flat());
      }
    };
  
    setComments([]); // Clear comments before fetching new comments for the new event
    fetchComments();
  }, [props.details]);


  const details = props.details;
  
  
 
  const [editForm, setEditForm] = useState({
    name: "",
    address: "",
    imageUrl: "",
    rate: 0,
    description: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateEvent(props.details._id, editForm)
    setTimeout(() => {
      props.updateNewEvents(true)
    }, 1500)
    props.set(false)
  };

  const handleDelete = () => {
    deleteEvent(props.details._id, props.user.user._id)
    setTimeout(() => {
      props.updateNewEvents(true)
    }, 1500)
    props.set(false)
  };

  const loaded = () => {
    const renderStars = (rating) => {
      const stars = [];
      for (let i = 0; i < rating; i++) {
        stars.push(<FaStar key={i} />);
      }
      return stars;
    };

    return (
      <>
        <h1>{details.name}</h1>
        <h2>{details.address}</h2>
        <img
          className="form-image"
          src={details.imageUrl}
          alt={details.name}
        />
        <h2>{details.description}</h2>
        <div className="rate">{renderStars(details.rate)}</div>
        <div>
      
    </div>

    <div className="comment-section">
        <h3>Comments:</h3>
        {comments.map((comment, index) => (
          <div key={index} className="content">
            <p>{comment.userName}: {comment.content[0]}</p>
          </div>
        ))}
        <form onSubmit={handleAddComment}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button className='add-button' type="submit">ADD</button>
        </form>
        </div>
      </>
    );
  };

  const loading = () => {
    return <h1>Loading ...</h1>;
  };

  useEffect(() => {
    if (details) {
      setEditForm(details);
    }
  }, [details]);

  if (!props.show) {
    return null;
  }

  return (
    <div className="ShowModal" ref={ref}>
      {details ? loaded() : loading()}
      {props.user.user._id === props.details.userId && (
        <>
          <button id="delete" onClick={handleDelete}>
            DELETE
          </button>
          <form onSubmit={handleSubmit}>
            <h3>EventName:</h3>
            <input
              type="text"
              value={editForm.name}
              name="name"
              placeholder="name"
              onChange={handleChange}
            />
            <h3>Address:</h3>
            <input
              type="text"
              value={editForm.address}
              name="address"
              placeholder="address"
              onChange={handleChange}
            />
            <h3>Description:</h3>
            <input
              type="text"
              value={editForm.description}
              name="description"
              placeholder="description"
              onChange={handleChange}
            />
            <input
              type="hidden"
              value={editForm.rate}
              name="rate"
            />
            <h3>Rating:</h3>
            <div className='show-rating'>
              <select
                value={editForm.rate}
                onChange={(e) => setEditForm((prevState) => ({ ...prevState, rate: parseInt(e.target.value) }))}
              >
                <option value="">Select a rating</option>
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
            <input type="submit" value="Update Event" />
          </form>
        </>
      )}
    </div>
  );
});



Show.displayName = 'Show'; 
export default Show;
