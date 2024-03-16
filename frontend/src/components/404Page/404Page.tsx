/**
 *Page that is displayed when visiting an invalid URL path.
 *@module components/404Page
 */
import React from 'react';
/**@ignore */
const NotFoundPage: React.FC = () => {
  return (
    <p style={{textAlign: "center", marginTop: "2rem"}}>404: Page Not Found</p>
  );
}

export default NotFoundPage;
