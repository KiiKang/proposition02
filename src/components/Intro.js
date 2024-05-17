import React, {useEffect, useState} from 'react';
import './Intro.css';
import '../App.css';
// import {signOut} from "aws-amplify/auth";
// import AWS from 'aws-sdk';

const Intro = (props) => {
    const [isReadMore, setIsReadMore] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);
    const [isPortrait, setIsPortrait] = useState(null)
    const [isLoading, setIsLoading] = useState(true);

    const [mouse, setMouse] = useState({x:null, y:null})
    const [showAnnoPreview, setShowAnnoPreview] = useState(false);

    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    }

    useEffect(() => {
        const updateMousePosition = ev => {
            if (ev.target.id === "anno-canvas"){
                let rect = ev.target.getBoundingClientRect()
                setMouse({x: ev.clientX - rect.left, y: ev.clientY - rect.top});
            } else {
                setMouse({x: null, y:null})
            }
        };
        window.addEventListener('mousemove', updateMousePosition);
        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);

    useEffect(() => {
        if (props.data.length !== 0) {
            let data_cleaned = props.data.filter(d => d.file_name)
            let imgSelected = data_cleaned[Math.floor(Math.random() * data_cleaned.length)];
            setImageUrl("https://ara-images.s3.amazonaws.com/" + imgSelected.file_name)
            const getImage = async (file_name) => {
                try {
                    let img = new Image();
                    img.src = "https://ara-images.s3.amazonaws.com/" + file_name
                    img.onload = () => {
                        setIsPortrait(img.height > img.width)
                    }
                } catch (err) {
                    console.error('Error getting image:', err);
                }
            }
            getImage(imgSelected.file_name);
            setIsLoading(false);
        }
    }, [props.data]);

    return (
        <div className='Intro-textbox bg-[rgba(255,255,255,0.5)] fixed min-h-fit border-neutral-800 border-2 w-[440px] p-[20px] pb-2'>
            <div className='Intro-textbox-title scale-x-[116%] text-outline-xs justify-center font-medium font-sans mt-1.5 mb-3.5 w-fit m-auto text-lg text-neutral-800 tracking-[0.37rem]'>
                Archive Reindex Archive
            </div>
            <div className='Intro-shader-container relative border-neutral-600'
                 onMouseEnter={() => setShowAnnoPreview(true)}
                 onMouseLeave={() => setShowAnnoPreview(false)}
                 style={{
                     height: isReadMore ? "400px" : 0,
                     border: isReadMore ? "1px solid" : '0',
                     // backgroundImage: imageUrl ? 'url(' + imageUrl + ')': null,
                     backgroundColor: "black",
                     borderRadius: !isLoading ? '0': '50%',
                     filter: !isLoading ? null : "blur(50px)",
                 }}>
                {isPortrait !== null ?
                    <img
                        className={'object-cover'}
                        src={imageUrl}
                        alt=''
                        loading='eager'
                        style={{
                            width: isPortrait ? '420px':'auto',
                            height: isPortrait ? 'auto':'420px',
                            scale: '102%'
                        }}
                    />
                    :null
                }
                <div className='image-anno w-full h-full relative m-0 left-0 bg-[rgba(255,255,255,0)] hover:bg-[rgba(255,255,255,0.2)] transition-colors cursor-crosshair'>
                    <div className='absolute text-[0.75rem] border-[0.5px] bg-[rgba(232,228,225,0.2)] border-neutral-800 w-fit max-w-full pr-1 pl-1 -translate-x-1/2 whitespace-nowrap'
                         style={{
                             left: mouse.x + 'px', top: mouse.y + 'px',
                             // visibility: showAnnoPreview ? "visible": "hidden"
                         }}
                    >
                        what do you see?
                    </div>
                </div>
            </div>
            {/*{*/}
            {/*    props.user ?*/}
            {/*    <div className='w-full flex p-3'>*/}
            {/*        <div className='w-full text-outline-sm font-medium text-xl font-sans' onClick={handleSignOut}>*/}
            {/*            <p className='m-auto cursor-pointer text-center'>sign out</p>*/}
            {/*        </div>*/}
            {/*    </div> :*/}
            {/*    <div className='flex p-3'>*/}
            {/*        /!* <div className='Intro-textbox-menu-button button-round-L' onClick={() => navigate("/signup") }>sign up</div> *!/*/}
            {/*        /!* <div className='Intro-textbox-menu-button button-round-L' onClick={() => navigate("/login") }>sign in</div> *!/*/}
            {/*        <div className='w-1/2 text-outline-sm font-medium text-xl font-sans'*/}
            {/*             onClick={() => {*/}
            {/*                 props.onShowAuth(true)*/}
            {/*                 props.onInOrUp(true)*/}
            {/*             }}*/}
            {/*        >*/}
            {/*            <p className='w-fit m-auto cursor-pointer'>sign up</p>*/}
            {/*        </div>*/}
            {/*        <div className='w-1/2 text-outline-sm font-medium text-xl font-sans'*/}
            {/*             onClick={() => {*/}
            {/*                 props.onShowAuth(true)*/}
            {/*                 props.onInOrUp(false)*/}
            {/*             }}*/}
            {/*        >*/}
            {/*            <p className='w-fit m-auto cursor-pointer'>sign in</p>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*}*/}

            <div className='text-xs mt-4 text-neutral-800 font-sans text-center cursor-pointer'
                 onClick={toggleReadMore}>
                <u>read more</u><br/>
                    ⌄
            </div>

            <div className='Intro-textbox-p max-h-[500px] overflow-y-scroll text-neutral-800 text-sm tracking-wide'
                 style={{
                     // visibility: isReadMore? "hidden": "visible",
                     height: isReadMore ? 0 : '500px'
                 }}>
                <p>
                    <b>Archive Reindex Archive (ARA)</b> is a web-based platform that presents a collection of photographic
                    archives from the National Geographic Magazine issues dating from 1945 to 1955, where visitors can
                    leave annotations of “what they see.” The images are masked with a fungus-like layer that represents
                    how a machine sees them, with the aim of reassembling the perception of internalized movements of
                    general viewers’ eyes upon encountering the images for the first time. ARA unearths archived remnants
                    of the aftermath of WWII—“expeditious” human movements of global colonization and imperialization
                    and the discrepancies between raw materials, human resources and capital. It collects contemporary
                    annotations that correct, question, and confront the uncomfortable gazes and the given semiotic relationships
                    in the archive to bring a collective means of slow, gentle recuperation to those subject to alterity.

                </p><p>
                    <b>ARA</b> is a full collaboration between <a href='https://ivettakang.com/'
                                                           target='_blank' rel='noreferrer'>Ivetta
                    Sunyoung Kang</a> and <a href='https://k--kang.com/' target='_blank'
                                                                      rel='noreferrer'>Kii (Wonki) Kang</a> through
                    which Ivetta’s interests in linguistics,
                    poetics, and ethnographic indexicality studies and Kii’s interests in the critical use of computation
                    and embodied semantics converge and intersect one another.
            </p><p>

                <b>ARA</b> is a platform for growing collections of texts through which authors,
                poets and writers respond to the latent concepts and emotions, emerged from, stuck to,
                and imbued with the artists throughout the entire creation.





                {/*<b>Archive Reindex Archive</b> presents an archival collection of photographic images and*/}
                    {/*captions from National Geographic issues from 1945 to 1959, explorable through the global map.*/}
                    {/*<br/><br/>*/}
                    {/*<b>Archive Reindex Archive</b> was conceived by <a href='https://ivettakang.com/'*/}
                    {/*                                                          target='_blank' rel='noreferrer'>Ivetta*/}
                    {/*Sunyoung Kang</a> within continuous scopes of their research-based practice, continued from*/}
                    {/*Kang’s project,*/}
                    {/*Proposition 2: Index (2020-2022). ARA has since been developed in a collaborative mode with an*/}
                    {/*artist and a web designer and developer <a href='https://k--kang.com/' target='_blank'*/}
                    {/*                                           rel='noreferrer'>Kii (Wonki) Kang</a>. It presents*/}
                    {/*photographic images and the original photo captions extracted from the 192 issues. It is formed*/}
                    {/*as an interactive, participatory website in which visitors are invited to leave annotations on*/}
                    {/*the archive materials that are masked with layers on which viewers' eyes focus first—an inversed*/}
                    {/*saliency map that deliberately reassembles the perception of the images. All the archive*/}
                    {/*presents, altogether and, respectively, a problematic grounding, mired with the aftermath of*/}
                    {/*WWII, the historical movements of global colonization, the material, capital, and mental*/}
                    {/*discrepancies between nations in terms of raw materials and human resources possessions and*/}
                    {/*national expansions. They also demonstrate multiple streams of historical linearity through*/}
                    {/*which shallow boundaries were shifted between such practices; colonial tools and anthropological*/}
                    {/*expeditions, changes of certain semantics of words in colonization and decolonization eras;*/}
                    {/*national expansionism (such as pan-Americanism) and global-wide trades and so on. They also*/}
                    {/*bring different connotations with the controversial nuance of the original caption given as a*/}
                    {/*holistic reading of the archive.*/}
                    {/*<br/><br/>*/}
                    {/*<b>Archive Reindex Archive</b> strives to collect contemporary annotations that sometimes*/}
                    {/*correct, question, and confront certain uncomfortable gazes the magazine often advocates and*/}
                    {/*evokes.*/}
                    {/*<br/><br/>*/}
                    {/*Perhaps, all the questions are still being asked, left for us to contemplate: who takes a photo*/}
                    {/*of who and why?; why is the particular photo taken that way?; what makes the author of some*/}
                    {/*specific photo captions make those captions?; what knowledge is being generated and erased at*/}
                    {/*the same time?; who intends the knowledge and who is excluded from the generation process?; what*/}
                    {/*importance do contemporary acts of reading and interpreting hold?*/}
                    {/*And finally, what other knowledge is being generated by your ‘now action’ of annotating the*/}
                    {/*archive as a means of reindexing the already-generated knowledge?*/}
                </p>
                <br/>
                <hr/>
                <p className='text-xs'>
                    Created by Ivetta Sunyoung Kang & Kii Kang
                    <br/>
                    Conceived by Ivetta Sunyoung Kang
                    <br/>
                    Web Design and Development by Kii Kang
                    <br/>
                    <i>PREDATOR</i> by Günen
                    <br/>
                    Project Assistant by Kyeonglin Park
                    {/*<br/>*/}
                    {/*Voice & spoken words*/}
                    {/*<br/>*/}
                    {/*Portuguese by Gabriel Sanceau Fuks*/}
                    {/*<br/>*/}
                    {/*Italian by Dalia Maini*/}
                    {/*<br/>*/}
                    {/*French by Eve Tagny & Matthew Wolkow*/}
                    {/*<br/>*/}
                    {/*Castellano and Mapuzugun by Günen*/}
                    {/*<br/>*/}
                    {/*English by Ivetta Sunyoung Kang*/}


                </p>
                <hr/>
                <p className='text-xs tracking-normal'>
                    The project was realized with the support from <a href='https://canadacouncil.ca/'
                                                                                    target='_blank'
                                                                                    rel='noreferrer'>Canada Council
                    for the Arts</a>.
                </p>
            </div>
        </div>
    )
}

export default Intro;
