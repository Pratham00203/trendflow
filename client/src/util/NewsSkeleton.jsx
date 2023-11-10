export default function NewsSection() {
  return (
    <>
      <div className='posts-section d-flex flex-col' style={{ gap: "35px" }}>
        <div className='article-skeleton'>
          <div
            className='section-1 d-flex align-center'
            style={{ gap: "10px" }}>
            <div className='small-img'></div>
            <div className='line' style={{ width: "15rem" }}></div>
          </div>
          <div
            className='section-2
            '>
            <div className='line'></div>
            <div className='line'></div>
            <div className='line'></div>
          </div>
          <div className='section-3'></div>
          <div
            className='line'
            style={{ marginTop: "10px", width: "15rem" }}></div>
        </div>
      </div>
    </>
  );
}
