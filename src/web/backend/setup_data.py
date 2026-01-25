"""
Dataset Setup Script
Downloads the Pins Face Recognition dataset from Kaggle and sets up the data folder
"""

import os
import shutil



def find_deepface_cache(start_dir: str) -> str | None:
    """Search for a folder named 'deepface_cache' under start_dir (recursively).
    Returns the absolute path to the first match or None if not found.
    """
    for root, dirs, files in os.walk(start_dir):
        for d in dirs:
            if d == 'deepface_cache':
                return os.path.join(root, d)
    return None


def copy_deepface_cache_to_test(cache_path: str, test_dir: str) -> int:
    """Copy the contents of cache_path into test_dir.
    Returns the number of files copied.
    """
    copied = 0
    for entry in os.listdir(cache_path):
        src_path = os.path.join(cache_path, entry)
        dst_path = os.path.join(test_dir, entry)

        try:
            if os.path.isdir(src_path):
                # merge directories: copy contents of the directory into dst_path
                if not os.path.exists(dst_path):
                    shutil.copytree(src_path, dst_path)
                    # count files copied
                    for _root, _dirs, files in os.walk(dst_path):
                        copied += len(files)
                else:
                    # dst exists: copy individual files
                    for root, _dirs, files in os.walk(src_path):
                        rel = os.path.relpath(root, src_path)
                        target_root = os.path.join(dst_path, rel) if rel != '.' else dst_path
                        os.makedirs(target_root, exist_ok=True)
                        for f in files:
                            sfile = os.path.join(root, f)
                            dfile = os.path.join(target_root, f)
                            shutil.copy2(sfile, dfile)
                            copied += 1
            else:
                # single file -> copy into test_dir
                os.makedirs(test_dir, exist_ok=True)
                shutil.copy2(src_path, dst_path)
                copied += 1
        except Exception as e:
            print(f"Error copying {src_path} -> {dst_path}: {e}")

    return copied

def setup_dataset():
    print("=" * 60)
    print("FACE RECOGNITION DATASET SETUP")
    print("=" * 60)
    
    # Install kagglehub if not present
    try:
        import kagglehub
    except ImportError:
        print("\nInstalling kagglehub...")
        os.system("pip install kagglehub")
        import kagglehub
    
    # Download dataset
    print("\nDownloading Pins Face Recognition dataset from Kaggle...")
    print("This may take a few minutes...\n")
    
    try:
        path = kagglehub.dataset_download("hereisburak/pins-face-recognition")
        print(f"\n✓ Dataset downloaded to: {path}")
    except Exception as e:
        print(f"\n✗ Error downloading dataset: {e}")
        print("\nIf you see an authentication error, you need to:")
        print("1. Create a Kaggle account at https://www.kaggle.com")
        print("2. Go to Settings > API > Create New Token")
        print("3. Place the kaggle.json file in ~/.kaggle/ (Linux/Mac) or C:\\Users\\<user>\\.kaggle\\ (Windows)")
        return False
    
    # Create data directories
    data_dir = os.path.join(os.path.dirname(__file__), "raw_data")
    os.makedirs(data_dir, exist_ok=True)
    
    # Find the dataset folder
    dataset_folder = os.path.join(path, "105_classes_pins_dataset")
    
    if not os.path.exists(dataset_folder):
        # Try direct path
        dataset_folder = path
        
    if os.path.exists(dataset_folder):
        # Copy or link the dataset
        print(f"\nSetting up data directory...")
        
        # List celebrity folders
        celeb_folders = [f for f in os.listdir(dataset_folder) if os.path.isdir(os.path.join(dataset_folder, f))]
        print(f"Found {len(celeb_folders)} celebrity folders")
        
        # Copy folders to raw_data
        copied = 0
        for folder in celeb_folders:
            src = os.path.join(dataset_folder, folder)
            dst = os.path.join(data_dir, folder)
            
            if not os.path.exists(dst):
                try:
                    shutil.copytree(src, dst)
                    copied += 1
                    if copied <= 5:
                        print(f"  ✓ Copied: {folder}")
                    elif copied == 6:
                        print(f"  ... copying remaining folders ...")
                except Exception as e:
                    print(f"  ✗ Error copying {folder}: {e}")
        
        print(f"\n✓ Copied {copied} celebrity folders to {data_dir}")
        
        # Count total images
        total_images = 0
        for folder in os.listdir(data_dir):
            folder_path = os.path.join(data_dir, folder)
            if os.path.isdir(folder_path):
                images = len([f for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
                total_images += images
        
        RAW_DIR = "./raw_data"
        TRAIN_DIR = "./data/train"
        TEST_DIR = "./data/test"
        SPLIT_RATIO = 0.8
        
        if(not(os.path.exists(TRAIN_DIR))):
            data_dir = os.path.join(os.path.dirname(__file__), "data", "train")
            os.makedirs(data_dir, exist_ok=True)
        
        if(not(os.path.exists(TEST_DIR))):
            data_dir = os.path.join(os.path.dirname(__file__), "data", "test")
            os.makedirs(data_dir, exist_ok=True)

        for person in os.listdir(RAW_DIR):
            person_path = os.path.join(RAW_DIR, person)
            images = os.listdir(person_path)
            
            split_idx = int(len(images) * SPLIT_RATIO)

            train_images = images[:split_idx]
            test_images = images[split_idx:]

            os.makedirs(os.path.join(TRAIN_DIR, person), exist_ok=True)
            os.makedirs(os.path.join(TEST_DIR, person), exist_ok=True)

            for img in train_images:
                shutil.copy(os.path.join(person_path, img), os.path.join(TRAIN_DIR, person, img))

            for img in test_images:
                shutil.copy(os.path.join(person_path, img), os.path.join(TEST_DIR, person, img))

        print(f"✓ Total images: {total_images}")
        print("\n" + "=" * 60)
        print("SETUP COMPLETE!")
        print("=" * 60)
        print(f"\nData directory: {data_dir}")
        print("You can now start the Flask backend with: python app.py")
        # Attempt to find a deepface_cache folder in the repository and copy its contents to data/test
        repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        cache_path = find_deepface_cache(repo_root)
        test_dir = os.path.join(os.path.dirname(__file__), "data", "test")
        if cache_path:
            print(f"\nFound deepface_cache at: {cache_path}")
            print(f"Copying deepface_cache contents into {test_dir}...")
            copied_files = copy_deepface_cache_to_test(cache_path, test_dir)
            print(f"✓ Copied {copied_files} files from deepface_cache into {test_dir}")
        else:
            print("\nNo deepface_cache folder found in the repository root. Skipping cache copy.")
        return True
    else:
        print(f"\n✗ Could not find dataset folder at {dataset_folder}")
        return False


if __name__ == "__main__":
    setup_dataset()
