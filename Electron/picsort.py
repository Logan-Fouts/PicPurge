import os
import shutil
import concurrent.futures
import argparse
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.inception_v3 import preprocess_input, decode_predictions

model = tf.keras.applications.InceptionV3(weights='imagenet', include_top=True)

def predict_and_move(args):
    image_path, output_folder = args
    img = image.load_img(image_path, target_size=(299, 299))
    x = image.img_to_array(img)
    x = preprocess_input(x)
    x = tf.expand_dims(x, axis=0)
    
    preds = model.predict(x)
    decoded_preds = decode_predictions(preds, top=1)[0][0]
    
    label = decoded_preds[1]
    confidence = decoded_preds[2]
    
    print(f"Predicted: {label} (Confidence: {confidence:.2f})")
    
    category_folder = os.path.join(output_folder, label)
    if not os.path.exists(category_folder):
        os.makedirs(category_folder)
    
    # Move the image to the predicted category folder
    new_image_path = os.path.join(category_folder, os.path.basename(image_path))
    shutil.move(image_path, new_image_path)

def process_batch(batch):
    with concurrent.futures.ThreadPoolExecutor() as executor:
        executor.map(predict_and_move, batch)

def main():
    print('penis')
    parser = argparse.ArgumentParser(description="Automatically sort images using AI")
    parser.add_argument("input_folder", help="Path to the folder containing images to be sorted")
    args = parser.parse_args()

    input_folder = os.path.expanduser(args.input_folder)
    output_folder = os.path.join(input_folder, "Filtered-Images")

    image_files = []
    for root, _, files in os.walk(input_folder):
        for image_filename in files:
            if image_filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                image_path = os.path.join(root, image_filename)
                image_files.append(image_path)

    batch_size = 500
    for i in range(0, len(image_files), batch_size):
        batch = image_files[i:i+batch_size]
        process_batch([(image_path, output_folder) for image_path in batch])

if __name__ == "__main__":
    main()
