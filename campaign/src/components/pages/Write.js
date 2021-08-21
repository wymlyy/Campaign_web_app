import React from "react";
import "../../App.css";
import TextEditor from "./TextEditor.jsx";
import Footer from '../Footer';

function Write() {
    return (
<>
        <div className="editor">
            <TextEditor />
            </div>
            <div className='footerWrite'>
                <Footer />
                </div>
</>
    );
}

export default Write;
