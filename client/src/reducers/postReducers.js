import { 
    SAVE_BLOG_REQUEST,
    SAVE_BLOG_SUCCESS,
    SAVE_BLOG_FAILED,
    UPLOAD_PHOTO_REQUEST,
    UPLOAD_PHOTO_SUCCESS,
    UPLOAD_PHOTO_FAILED,
    GET_POSTS_REQUEST,
    GET_POSTS_FAILURE,
    GET_POSTS_SUCCESS,
    GET_BLOG_REQUEST,
    GET_BLOG_FAILURE,
    GET_BLOG_SUCCESS,
    GET_HOME_POSTS_REQUEST,
    GET_HOME_POSTS_SUCCESS,
    GET_HOME_POSTS_FAILURE,
    READ_BLOG_REQUEST, 
    READ_BLOG_SUCCESS, 
    READ_BLOG_FAILURE,
    ADD_COMMENT_REQUEST,
    ADD_COMMENT_SUCCESS,
    ADD_COMMENT_FAILURE,
    DISLIKE_POST_REQUEST,
    DISLIKE_POST_SUCCESS,
    DISLIKE_POST_FAILURE,
    LIKE_POST_REQUEST,
    LIKE_POST_SUCCESS,
    LIKE_POST_FAILURE
    
} from "../constants/postConstants";

export const postReducers = (
    state= {
        posts:{
            name:'',
            profilePhoto:'',
            coverPhoto:'',
            about:'',
            Published:[], 
            Draft: []
        }, 
        PublishedBlogs:[], 
        loading:false,
        ReadBlog:{
            AuthorId:"",
            AuthorName:"",
            AuthorPhoto:"",
            Body:"",
            CreatedAt:"",
            SubText:"",
            Thumbnail:"",
            Title:"",
            comments:[],
            isAlreadyLiked: false,
            likes:0
        }
    },
    action)=> 
{

    switch(action.type){
        case SAVE_BLOG_REQUEST:
        case UPLOAD_PHOTO_REQUEST:
        case GET_POSTS_REQUEST:
        case GET_BLOG_REQUEST:
        case GET_HOME_POSTS_REQUEST:
        case ADD_COMMENT_REQUEST:
            return{
                ...state,
                loading:true
            }

        case SAVE_BLOG_SUCCESS:
        case SAVE_BLOG_FAILED:
        case UPLOAD_PHOTO_SUCCESS:
        case UPLOAD_PHOTO_FAILED:
        case GET_POSTS_FAILURE:
        case GET_BLOG_SUCCESS:
        case GET_BLOG_FAILURE:
        case GET_HOME_POSTS_FAILURE:
        case ADD_COMMENT_FAILURE:
            return{
                ...state,
                loading:false
            }

        case GET_POSTS_SUCCESS:
            return{
                ...state,
                loading: false,
                posts:action.payload
            }
        case GET_HOME_POSTS_SUCCESS:
            return{
                ...state,
                loading: false,
                PublishedBlogs: action.payload
            }
        case READ_BLOG_REQUEST:
            return{
                ...state,
                loading:true,
                ReadBlog:{
                    AuthorId:"",
                    AuthorName:"",
                    AuthorPhoto:"",
                    Body:"",
                    CreatedAt:"",
                    SubText:"",
                    Thumbnail:"",
                    Title:"",
                    comments:[],
                    isAlreadyLiked: false,
                    likes:0
                }
            }
        case READ_BLOG_SUCCESS:
        //case ADD_COMMENT_SUCCESS:
            return{
                ...state,
                loading:false,
                ReadBlog: action.payload
            }
        case READ_BLOG_FAILURE:
            return{
                ...state,
                loading: false,
            }
        case ADD_COMMENT_SUCCESS:
            return{
                ...state,
                loading: false,
                ReadBlog:{
                    ...state.ReadBlog,
                    comments: action.payload
                }

            }
        case DISLIKE_POST_REQUEST:
            return{
                ...state,
                loading: false,
                ReadBlog:{
                    ...state.ReadBlog,
                    isAlreadyLiked:false
                }
            }
        case DISLIKE_POST_SUCCESS:
            return{
                ...state,
                loading: false,
                ReadBlog:{
                    ...state.ReadBlog,
                    isAlreadyLiked:false,
                    likes: action.payload
                }
            }
        case DISLIKE_POST_FAILURE:
            return{
                ...state,
                loading: false,
                ReadBlog:{
                    ...state.ReadBlog,
                    isAlreadyLiked:true,
                    likes: action.payload
                }
            }
        case LIKE_POST_REQUEST:
            return{
                ...state,
                loading: false,
                ReadBlog:{
                    ...state.ReadBlog,
                    isAlreadyLiked:true
                }
            }
        case LIKE_POST_SUCCESS:
            return{
                ...state,
                loading: false,
                ReadBlog:{
                    ...state.ReadBlog,
                    isAlreadyLiked:true,
                    likes: action.payload
                }
            }
        case LIKE_POST_FAILURE:
            return{
                ...state,
                loading: false,
                ReadBlog:{
                    ...state.ReadBlog,
                    isAlreadyLiked:false,
                    likes: action.payload
                }
            }
        default: return state
    }
}
