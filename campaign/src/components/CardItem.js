import React from 'react';
import { Link } from 'react-router-dom';


function CardItem(props) {
  return (
    <>
      <li className='cards__item'>
        <Link className='cards__item__link' to={props.path}>
          <figure className='cards__item__pic-wrap' data-category={props.topic}>
            <img
              className='cards__item__img'
              alt='Campaign Image'
              src={props.src}
            />
          </figure>
          <div className='cards__item__info'>
            <h5 className='cards__item__title'>{props.title}</h5>
          </div>
          <div className='cards__item__info'>
            <h5 className='cards__item__text'>{props.text}</h5>
          </div>
          <div className='cards_item_footer'>
            <Link className='cards_item_author' to={props.prof}>User: {props.username}</Link>
            <div className='cards_item_dateTime'>{props.dateTime}</div>
            
          </div>
          
        </Link>
      </li>
    </>
  );
}

export default CardItem;
