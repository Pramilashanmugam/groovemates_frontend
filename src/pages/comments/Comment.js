import React from 'react';

function Comment({ id, owner, description, created_at, profile_image, replies }) {
  return (
    <div key={id} style={{ marginBottom: "15px" }}>
      <div className="comment-header">
        <img src={profile_image} alt={owner} style={{ width: "30px", height: "30px", borderRadius: "50%" }} />
        <strong>{owner}</strong>
      </div>
      <p>{description}</p>
      <small>{created_at}</small>

      {replies && replies.length > 0 && (
        <div style={{ marginLeft: "20px" }}>
          <h5>Replies:</h5>
          {replies.map((reply) => (
            <Comment key={reply.id} {...reply} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Comment;
