import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import { Card, Header, Tab, Image, Grid, Button, Icon } from "semantic-ui-react";
import PhotoUploadWidget from "../../../app/common/uploads/PhotoUploadWidget";
import { Photo, Profile } from "../../../app/models/Profile";
import { useStore } from "../../../app/stores/store";

interface Props {
	profile: Profile;
}

export default observer(function ProfilePhotos({ profile }: Props) {
	const { profileStore } = useStore();
	const [addPhotoMode, setAddPhotoMode] = useState(false);
	const [target, setTarget] = useState("");

	function handleUploadPhoto(file: Blob) {
		profileStore.uploadPhoto(file).then(() => setAddPhotoMode(false));
	}

	function handleSetMainPhoto(photo: Photo, event: SyntheticEvent<HTMLButtonElement>) {
		setTarget(event.currentTarget.name);
		profileStore.setMainPhoto(photo);
	}

	function handleDeletePhoto(photo: Photo, event: SyntheticEvent<HTMLButtonElement>) {
		setTarget(event.currentTarget.name);
		profileStore.deletePhoto(photo);
	}

	return (
		<Tab.Pane>
			<Grid>
				<Grid.Column width={16}>
					<Header floated="left" icon="image" content="Photos" />
					{profileStore.isCurrentUser && <Button floated="right" basic content={addPhotoMode ? "Cancel" : "Add Photo"} onClick={() => setAddPhotoMode(!addPhotoMode)} />}
				</Grid.Column>
				<Grid.Column width={16}>
					{addPhotoMode ? (
						<PhotoUploadWidget uploadPhoto={handleUploadPhoto} loading={profileStore.uploading} />
					) : (
						<Card.Group itemsPerRow={5}>
							{profile.photos?.map((photo) => (
								<Card key={photo.id}>
									<Image src={photo.url} />
									{profileStore.isCurrentUser && (
										<Button.Group fluid widths={2}>
											{/* set main button */}
											<Button
												animated="vertical"
												color="green"
												onClick={(e) => handleSetMainPhoto(photo, e)}
												name={"main" + photo.id}
												disabled={photo.isMain}
												loading={target === "main" + photo.id && profileStore.loadingPhoto}
											>
												<Button.Content visible>
													<Icon name="user circle" />
												</Button.Content>
												<Button.Content hidden content="set main" />
											</Button>

											{/* delete button */}
											<Button
												animated="vertical"
												color="red"
												disabled={photo.isMain}
												name={photo.id}
												onClick={(e) => handleDeletePhoto(photo, e)}
												loading={target === photo.id && profileStore.loadingPhoto}
											>
												<Button.Content visible>
													<Icon name="trash" />
												</Button.Content>
												<Button.Content hidden color="red" content="delete" />
											</Button>
										</Button.Group>
									)}
								</Card>
							))}
						</Card.Group>
					)}
				</Grid.Column>
			</Grid>
		</Tab.Pane>
	);
});
