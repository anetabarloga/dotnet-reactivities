import React, { useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";

interface Props {
	loading: boolean;
	uploadPhoto: (file: Blob) => void;
}

export default function PhotoUploadWidget({ loading, uploadPhoto }: Props) {
	const [files, setFiles] = useState<any>([]);
	const [cropper, setCropper] = useState<Cropper>();

	function onCrop() {
		if (cropper) {
			cropper.getCroppedCanvas().toBlob((blob) => uploadPhoto(blob!));
		}
	}

	// cleanup preview urls
	useEffect(() => {
		return () => {
			files.forEach((file: any) => URL.revokeObjectURL(file.preview));
		};
	}, [files]);

	return (
		<Grid>
			<Grid.Column width={4}>
				<Header sub color="teal" content="Step 1 - Add Photo"></Header>
				<PhotoWidgetDropzone setFiles={setFiles} />
			</Grid.Column>
			<Grid.Column width={1} />
			<Grid.Column width={4}>
				<Header sub color="teal" content="Step 2 - Resize Image"></Header>
				{files && files.length > 0 && <PhotoWidgetCropper setCropper={setCropper} preview={files[0].preview} />}
			</Grid.Column>
			<Grid.Column width={1} />
			<Grid.Column width={4}>
				<Header sub color="teal" content="Step 3 - Preview and Upload"></Header>
				<>
					<div className="img-preview" style={{ minHeight: 200, overflow: "hidden" }} />
					{files && files.length > 0 && (
						<Button.Group widths={2}>
							<Button icon="check" loading={loading} onClick={onCrop} positive />
							<Button icon="close" disable={loading ? true : false} onClick={() => setFiles([])} />
						</Button.Group>
					)}
				</>
			</Grid.Column>
		</Grid>
	);
}
