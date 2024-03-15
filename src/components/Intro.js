import React, {useEffect, useState} from 'react';
import './Intro.css'

import Cookies from 'js-cookie';

const Intro = (props) => {
    const [isReadMore, setIsReadMore] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    }

    function signOut() {
        Cookies.remove("user");
        window.location.reload();
    }

    useEffect(() => {
        if (props.data.length !== 0) {
            let data_cleaned = props.data.filter(d => d.file_name)
            let imgSelected = data_cleaned[Math.floor(Math.random() * data_cleaned.length)];
            setImageUrl("https://ara-images.s3.amazonaws.com/" + imgSelected.file_name)
        }
    }, [props.data]);

    return (
        <div className='Intro-textbox fixed min-h-fit outline-neutral-800 outline-2'>
            <div className='m-[30px] text-5xl underline text-neutral-800'>
                <p>What do you see?</p>
            </div>
            <div className='Intro-shader-container'
                 style={{
                     height: isReadMore ? "40vh" : 0,
                     backgroundImage: imageUrl ? 'url(' + imageUrl + ')': null,
                     backgroundColor: "black",
                     borderRadius: imageUrl ? '0': '50%',
                     filter: imageUrl ? null : "blur(50px)",
                 }}>
                {/*<img src={imageUrl} alt='' loading='lazy'/>*/}
                {/* { !imgLoading?
                        <img
                        src={'/images/gl/' + imgSelected}
                        key={imgSelected} alt='' loading='lazy'></img>:null
                } */}
            </div>

            {Cookies.get("user") ?
                <div className='Intro-textbox-menu'>
                    <div className='Intro-textbox-menu-button button-round-L' onClick={signOut}>sign out</div>
                </div> :
                <div className='Intro-textbox-menu'>
                    {/* <div className='Intro-textbox-menu-button button-round-L' onClick={() => navigate("/signup") }>sign up</div> */}
                    {/* <div className='Intro-textbox-menu-button button-round-L' onClick={() => navigate("/login") }>sign in</div> */}
                    <div className='Intro-textbox-menu-button text-3xl font-sans'>sign up</div>
                    <div className='Intro-textbox-menu-button text-3xl font-sans'>sign in</div>
                </div>
            }
            <div className='mb-2 leading-5 text-sm text-center cursor-pointer'
                 onClick={toggleReadMore}>
                <u>read more</u><br/>
                    ⌄
            </div>

            <div className='Intro-textbox-p'
                 style={{
                     // visibility: isReadMore? "hidden": "visible",
                     height: isReadMore ? 0 : '500px'
                 }}>
                <p>
                    <b>Archive Reindex Archive</b> presents an archival collection of photographic images and
                    captions from National Geographic issues from 1945 to 1959, explorable through a global map.
                    <br/><br/>
                    <b>Archive Reindex Archive</b> was conceived by <a href='https://ivettakang.com/'
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
                    <b>Archive Reindex Archive</b> strives to collect contemporary annotations that sometimes
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
                </p><br/>
                <hr/>
                <p className='mt-2 text-xs'>
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
