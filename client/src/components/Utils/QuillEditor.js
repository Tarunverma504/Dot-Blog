import React from 'react';
import ReactQuill, { Quill } from 'react-quill';
import "react-quill/dist/quill.snow.css";
import axios from 'axios';

class QuillEditor extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            editorHtml:""
        };
    }

    handleChange = (html) => {
        // console.log('html', html)

         this.setState({
             editorHtml: html
         }, () => {
            this.props.onEditorChange(this.state.editorHtml);
        });
    };

    render(){
        return(
            <div>
                {/* <div id="toolbar">
                <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
                        <option value="1" />
                        <option value="2" />
                        <option value="" />
                    </select>
                    <button className="ql-bold" />
                    <button className="ql-italic" />
                    <button className="ql-underline" />
                    <button className="ql-strike" />
                </div> */}
                <ReactQuill
                    ref={(el) => { this.reactQuillRef = el }}
                    theme={'snow'}
                    onChange={this.handleChange}
                    formats={this.formats}
                    // value={this.state.editorHtml}
                    placeholder={this.props.placeholder}
                />
            </div>
        )
    }

    formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        // 'image', 'video', 'file', 'link',"code-block", "video", "blockquote", "clean"
    ];

}

export default QuillEditor;
