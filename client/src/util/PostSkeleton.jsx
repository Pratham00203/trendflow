export default function PostSkeleton() {
  return (
    <>
      <div
        className='post-skeleton-loader d-flex flex-col'
        style={{ gap: "20px" }}>
        <div className='post-skeleton'>
          <div
            className='post-skeleton-info d-flex align-center'
            style={{ gap: "15px", marginBottom: "20px" }}>
            <div className='post-skeleton-img'></div>
            <div
              className='post-skeleton-username d-flex flex-col'
              style={{ gap: "10px" }}>
              <div></div>
              <div></div>
            </div>
          </div>
          <div className='post-skeleton-lines'></div>
          <div className='post-skeleton-lines'></div>
          <div className='post-skeleton-lines'></div>
          <div className='post-skeleton-lines'></div>
          <div className='post-skeleton-lines'></div>
        </div>
        <div className='post-skeleton'>
          <div
            className='post-skeleton-info d-flex align-center'
            style={{ gap: "15px", marginBottom: "20px" }}>
            <div className='post-skeleton-img'></div>
            <div
              className='post-skeleton-username d-flex flex-col'
              style={{ gap: "10px" }}>
              <div></div>
              <div></div>
            </div>
          </div>
          <div className='post-skeleton-lines'></div>
          <div className='post-skeleton-lines'></div>
          <div className='post-skeleton-lines'></div>
          <div className='post-skeleton-lines'></div>
          <div className='post-skeleton-lines'></div>
        </div>
        <div className='post-skeleton'>
          <div
            className='post-skeleton-info d-flex align-center'
            style={{ gap: "15px", marginBottom: "20px" }}>
            <div className='post-skeleton-img'></div>
            <div
              className='post-skeleton-username d-flex flex-col'
              style={{ gap: "10px" }}>
              <div></div>
              <div></div>
            </div>
          </div>
          <div className='post-skeleton-lines'></div>
          <div className='post-skeleton-lines'></div>
          <div className='post-skeleton-lines'></div>
          <div className='post-skeleton-lines'></div>
          <div className='post-skeleton-lines'></div>
        </div>
      </div>
    </>
  );
}
