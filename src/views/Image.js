import React from 'react';
import BlurryBackdrop from "../components/BlurryBackdrop";
import ImageReel from "./ImageReel";

const Image = (props) => {
    return (
        <div>
            <BlurryBackdrop bg={true}/>
            <ImageReel data={props.data}
                       user={props.user}
                       filteredYear={props.filteredYear}
                       isLocked={props.isLocked}
                       annoData={props.annoData}
            />
        </div>
    );
}

export default Image;
