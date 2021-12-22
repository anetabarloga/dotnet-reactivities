import React from "react";
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";

interface Props {
	setCropper: (cropper: Cropper) => void;
	preview: string;
}

export default function PhotoWidgetCropper({ setCropper, preview }: Props) {
	return (
		<Cropper
			src={preview}
			style={{ height: 200, width: "100%" }}
			// aspect ratio will enforce square images
			initialAspectRatio={1}
			aspectRatio={1}
			preview=".img-preview"
			guides={false}
			viewMode={1}
			autoCropArea={1}
			background={false}
			onInitialized={(cropper) => setCropper(cropper)}
		/>
	);
}
