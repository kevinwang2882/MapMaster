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

  const handleAddComment = (event) => {
    event.preventDefault();
    if (newComment.trim() === '') {
      return;
    }
    const updatedComments = [...content, { text: newComment }];
    setContent(updatedComments);
    createComment(props.details._id, props.user.user._id, newComment,props.user.user.userName);
    setNewComment('');
  };

  useEffect(() => {
    const fetchComments = async () => {
      const commentsData = [];
      if (props.details && props.details.comments) { // Check if props.details.comments is not null
        for (const commentId of props.details.comments) {
          const comment = await getComment(commentId); // Fetch comment content
          commentsData.push(comment);
        }
      }
      setComments(commentsData);
    };
  
    fetchComments();
  }, [props.details]);
  
  const details = props.details;
  
  console.log(details)
  console.log(comments)
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
    }, 1000)
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
      {comments.map((comment, index) => (
        <h3 key={index}>{comment.author}: {comment.content}</h3>
      ))}
    </div>

    <div className="comment-section">
      <h3>{props.user.user.userName}:</h3>
      <h3>Comments:</h3>
      {content.map((content, index) => (
        <div key={index} className="content">
          <p>{props.user.user.userName}: {content.text}</p>
        </div>
      ))}
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button type="submit">Add</button>
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
