// src/components/CommentSection.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

function CommentSection(props) {
    // Now expecting both portfolioId and blogId for a nested comment collection
    var portfolioId = props.portfolioId;
    var blogId = props.blogId;
    var [comments, setComments] = useState([]);
    // Added a new field "imageUrl" to store a link, alongside name and comment text.
    var [newComment, setNewComment] = useState({ name: '', comment: '', imageUrl: '' });

    // Fetch existing comments for this blog post from Firestore
    useEffect(function () {
        async function fetchComments() {
            try {
                // Using nested collection: portfolios/{portfolioId}/blogs/{blogId}/comments
                var commentsRef = collection(db, 'portfolios', portfolioId, 'blogs', blogId, 'comments');
                var querySnapshot = await getDocs(commentsRef);
                var commentsList = querySnapshot.docs.map(function (doc) {
                    return Object.assign({ id: doc.id }, doc.data());
                });
                setComments(commentsList);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        }
        fetchComments();
    }, [portfolioId, blogId]);

    // Handle input change for all fields (name, comment text, and image URL)
    function handleInputChange(e) {
        var field = e.target.name;
        var value = e.target.value;
        setNewComment(Object.assign({}, newComment, { [field]: value }));
    }

    // Handle form submission: validate and add new comment to Firestore
    async function handleSubmit(e) {
        e.preventDefault();
        if (!newComment.name.trim() || !newComment.comment.trim()) {
            alert('Please fill in both your name and comment.');
            return;
        }
        try {
            var commentsRef = collection(db, 'portfolios', portfolioId, 'blogs', blogId, 'comments');
            // Save the comment with the provided image URL (if any)
            var docRef = await addDoc(commentsRef, {
                name: newComment.name,
                comment: newComment.comment,
                imageUrl: newComment.imageUrl || '', // empty string if nothing entered
                createdAt: new Date()
            });
            var addedComment = Object.assign({}, newComment, { id: docRef.id, createdAt: new Date() });
            setComments([addedComment].concat(comments));
            // Reset the form fields
            setNewComment({ name: '', comment: '', imageUrl: '' });
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Error posting comment. Please try again.');
        }
    }

    // Render the component using React.createElement
    return React.createElement(
        'div',
        { className: 'comment-section' },
        React.createElement('h3', null, 'Leave a Comment'),
        React.createElement(
            'form',
            { onSubmit: handleSubmit },
            React.createElement('input', {
                type: 'text',
                name: 'name',
                placeholder: 'Your Name',
                value: newComment.name,
                onChange: handleInputChange,
                className: 'input-field'
            }),
            React.createElement('textarea', {
                name: 'comment',
                placeholder: 'Your Comment',
                value: newComment.comment,
                onChange: handleInputChange,
                className: 'textarea-field'
            }),
            // NEW: Field to paste an image URL (like in your portfolio edit for profile pictures)
            React.createElement('input', {
                type: 'text',
                name: 'imageUrl',
                placeholder: 'Image URL (optional)',
                value: newComment.imageUrl,
                onChange: handleInputChange,
                className: 'input-field'
            }),
            React.createElement(
                'button',
                { type: 'submit', className: 'button-primary' },
                'Post Comment'
            )
        ),

        // NEW: Display the dynamic comment count
        React.createElement(
            'p',
            {
                className: 'comments-count',
                style: { fontWeight: 'bold', color: '#0D0D0D' }
            },
            comments.length + " comments posted"
        ),

        React.createElement(
            'div',
            { className: 'comments-list' },
            comments.length > 0
                ? comments.map(function (comment) {
                    return React.createElement(
                        'div',
                        { key: comment.id, className: 'comment' },
                        React.createElement(
                            'p',
                            null,
                            React.createElement('strong', null, comment.name + ' said:')
                        ),
                        React.createElement('p', null, comment.comment),
                        // If an image URL is provided, render the image
                        comment.imageUrl &&
                        React.createElement('img', {
                            src: comment.imageUrl,
                            alt: 'Comment image',
                            className: 'comment-image'
                        })
                    );
                })
                : React.createElement('p', null, 'No comments yet. Be the first to comment!')
        )
    );
}
//original1
export default CommentSection;
