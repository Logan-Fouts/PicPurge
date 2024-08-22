import numpy as np
from scipy.spatial import distance
from tensorflow.keras.applications.vgg16 import VGG16, preprocess_input
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing import image


class VGG:
    def __init__(self, threshold=0.6):
        self.name = "VGG"
        self.threshold = threshold
        self.duplicates = []
        self.possible_duplicates = []

        # Don't include top classification layer
        base_model = VGG16(weights="imagenet", include_top=False)
        # Output of the second-to-last dense layer used as features
        self.model = Model(
            inputs=base_model.inputs, outputs=base_model.layers[-1].output
        )

    def process(self, image_paths):
        """
        Takes provided image paths and classifies them as duplicates, not duplicates, or unsure.
        """
        features = [self._vgg_features(path) for path in image_paths]
        num_images = len(image_paths)
        image_paths = list(image_paths)

        for i in range(num_images):
            for j in range(i + 1, num_images):

                similarity = self._cosine_similarity(features[i], features[j])

                if similarity > self.threshold:
                    self.duplicates.append((image_paths[i], image_paths[j]))
                else:
                    self.possible_duplicates.extend((image_paths[i], image_paths[j]))

    def _vgg_features(self, image_path):
        """
        Extracts features from an image using VGG16.
        """
        img = image.load_img(image_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        expanded_img_array = np.expand_dims(img_array, axis=0)
        preprocessed_img = preprocess_input(expanded_img_array)
        features = self.model.predict(preprocessed_img)
        return features.flatten()

    def _cosine_similarity(self, vector_a, vector_b):
        """
        Computes the cosine similarity between two vectors using scipy.
        """
        similarity = 1 - distance.cosine(vector_a, vector_b)
        return similarity
