import React from 'react';
import ReactPaginate from 'react-paginate';

const Paginacion = ({ pageCount, onPageChange }) => {
  return (
        <ReactPaginate
            previousLabel={'Anterior'}
            nextLabel={'Siguiente'}
            breakLabel={'...'}
            breakClassName={'inline-block mx-1'}
            pageCount={pageCount}
            initialPage={0}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={onPageChange}
            containerClassName={'flex justify-center my-4'}
            pageClassName={'inline-block mx-1'}
            pageLinkClassName={'px-3 py-1 border rounded text-blue-500 hover:bg-blue-500 hover:text-white'}
            previousClassName={'inline-block mx-1'}
            previousLinkClassName={'px-3 py-1 border rounded text-blue-500  hover:bg-blue-500 hover:text-white'}
            nextClassName={'inline-block mx-1'}
            nextLinkClassName={'px-3 py-1 border rounded text-blue-500  hover:bg-blue-500 hover:text-white'}
            activeClassName={'bg-blue-600 text-white'}
            activeLinkClassName={'bg-blue-600 text-white font-bold'}
        />
  );
};

export default Paginacion;
