import React, {useEffect, useState} from 'react';
import AWS from 'aws-sdk';
import './Intro.css'
// import {useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios";
import {tsvToArray} from "../helpers";

const Intro = ({bucketName, objectKey}) => {
    const [isReadMore, setIsReadMore] = useState(true);
    const [imageData, setImageData] = useState([]);
    const [imgSelected, setImgSelected] = useState(null);
    const [imgLoading, setImgLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState('');

    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    }
    // let navigate = useNavigate();

    function signOut() {
        Cookies.remove("user");
        window.location.reload();
    }

    useEffect(() => {

        const getImage = async (key) => {
            if (loading) return
            console.log(process.env.AWS_ACCESS_KEY_ID)
            AWS.config.update({
                accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
                region: 'us-east-1',
            });

            const s3 = new AWS.S3();
            const bucketName = 'ara-images';
            try {
                // Get a signed URL for the S3 object
                const signedUrl = await s3.getSignedUrlPromise('getObject', {
                    Bucket: bucketName,
                    Key: key,
                    Expires: 60, // URL expiration time in seconds
                });
                setImageUrl(signedUrl);
            } catch (error) {
                console.error('Error getting image:', error);
            } finally {
                setImgLoading(false);
            }
        };
        getImage('test.png');
    }, [imageData]);

    useEffect(() => {
        const getData = async () => {
            try {
                let response = await axios.get('./images.tsv');
                setImageData(tsvToArray(response.data));
            } catch (err) {
                console.log(err.message);
                setImageData(null);
            } finally {
                setLoading(false);
            }
        }
        getData()
    }, []);

    return (
        <div className='Intro-textbox'>
            <div className='serif Intro-textbox-title '>
                what do you see?
            </div>
            <div className='serif Intro-textbox-capt' style={{color: "gray"}}>
                Click a photo on the map.<br/>
                Annotate it, responding to the prompt above.<br/>
                Sign in below to make annotations.<br/><br/>
                {/* The annotations will be collected as <i>re-index</i>.<br/> */}
            </div>
            <div className='Intro-textbox-capt' style={{fontFamily: "Helvetica", fontSize: "0.8rem"}}>
                *THE ANNOTATION AND SIGN IN IS STILL UNDER CONSTRUCTION.
            </div>
            <div className='Intro-shader-container'
                 style={{
                     height: isReadMore ? "40vh" : 0,
                     backgroundImage: imgLoading ? null : 'url(' + imageUrl + ')'
                 }}>
                {/*<img src={imageUrl} alt='' loading='lazy'/>*/}
                {/* { !imgLoading?
                        <img
                        src={'/images/gl/' + imgSelected}
                        key={imgSelected} alt='' loading='lazy'></img>:null
                } */}
            </div>

            {/* <div className='Intro-shader-container'
            style={{
                height: isReadMore? "500px": 0
            }}>
                <iframe src="https://www.shadertoy.com/embed/MlsXDr?gui=false&t=10&paused=false&muted=true"></iframe>
            </div> */}
            {Cookies.get("user") ?
                <div className='Intro-textbox-menu'>
                    <div className='Intro-textbox-menu-button button-round-L' onClick={signOut}>sign out</div>
                </div> :
                <div className='Intro-textbox-menu'>
                    {/* <div className='Intro-textbox-menu-button button-round-L' onClick={() => navigate("/signup") }>sign up</div> */}
                    {/* <div className='Intro-textbox-menu-button button-round-L' onClick={() => navigate("/login") }>sign in</div> */}
                    <div className='Intro-textbox-menu-button button-round-M'>sign up</div>
                    <div className='Intro-textbox-menu-button button-round-M'>sign in</div>

                </div>
            }
            <div className='serif Intro-textbox-readmore' onClick={toggleReadMore}>
                <center>read more<br/>
                    ⌄
                </center>
            </div>
            <div className='Intro-textbox-p serif'
                 style={{
                     // visibility: isReadMore? "hidden": "visible",
                     height: isReadMore ? 0 : '500px'
                 }}>
                <p>
                    <b><i>Archive Reindex Archive</i></b> presents an archival collection of photographic images and
                    captions from National Geographic issues from 1945 to 1959, explorable through a global map.
                    <br/><br/>
                    <b><i>Archive Reindex Archive</i></b> was conceived by <a href='https://ivettakang.com/'
                                                                              target='_blank' rel='noreferrer'>Ivetta
                    Sunyoung Kang</a> within continuous scopes of their research-based practice, continued from
                    Kang’s project,
                    Proposition 2: Index (2020-2022). ARA has since been developed in a collaborative mode with an
                    artist and a web designer and developer <a href='https://k--kang.com/' target='_blank'
                                                               rel='noreferrer'>Kii (Wonki) Kang</a>. It presents
                    photographic images and the original photo captions extracted from the 192 issues. It is formed
                    as an interactive, participatory website in which visitors are invited to leave annotations on
                    the archive materials that are masked with layers on which viewers' eyes focus first—an inversed
                    saliency map that deliberately reassembles the perception of the images. All the archive
                    presents, altogether and, respectively, a problematic grounding, mired with the aftermath of
                    WWII, the historical movements of global colonization, the material, capital, and mental
                    discrepancies between nations in terms of raw materials and human resources possessions and
                    national expansions. They also demonstrate multiple streams of historical linearity through
                    which shallow boundaries were shifted between such practices; colonial tools and anthropological
                    expeditions, changes of certain semantics of words in colonization and decolonization eras;
                    national expansionism (such as pan-Americanism) and global-wide trades and so on. They also
                    bring different connotations with the controversial nuance of the original caption given as a
                    holistic reading of the archive.
                    <br/><br/>
                    <b><i>Archive Reindex Archive</i></b> strives to collect contemporary annotations that sometimes
                    correct, question, and confront certain uncomfortable gazes the magazine often advocates and
                    evokes.
                    <br/><br/>
                    Perhaps, all the questions are still being asked, left for us to contemplate: who takes a photo
                    of who and why?; why is the particular photo taken that way?; what makes the author of some
                    specific photo captions make those captions?; what knowledge is being generated and erased at
                    the same time?; who intends the knowledge and who is excluded from the generation process?; what
                    importance do contemporary acts of reading and interpreting hold?
                    And finally, what other knowledge is being generated by your ‘now action’ of annotating the
                    archive as a means of reindexing the already-generated knowledge?
                </p>
                <hr/>
                <p className='subtitle'>
                    The project was realized thanks to the generous support from <a href='https://canadacouncil.ca/'
                                                                                    target='_blank'
                                                                                    rel='noreferrer'>Canada Council
                    for the Arts</a>.
                </p><br/>
            </div>
        </div>
    )
}

export default Intro;
