import os
import sys
from bs4 import BeautifulSoup

def process_html_files():
    # Quarto passes helpful environment variables during rendering
    output_dir = os.environ.get("QUARTO_PROJECT_OUTPUT_DIR", "_site")
    
    for root, _, files in os.walk(output_dir):
        for file in files:
            if file.endswith(".html"):
                file_path = os.path.join(root, file)
                
                # Read the rendered HTML
                with open(file_path, "r", encoding="utf-8") as f:
                    soup = BeautifulSoup(f.read(), "html.parser")
                
                # --- EXAMPLE MODIFICATION ---
                # Add a custom attribute or modify tags
                for header in soup.find_all(["h1", "h2"]):
                    header["data-processed"] = "true"
                
                # Inject a custom tracking script or CSS string
                custom_script = soup.new_tag("script")
                custom_script.string = "console.log('HTML post-processed successfully!');"
                if soup.body:
                    soup.body.append(custom_script)
                # ----------------------------
                
                # Overwrite the file with changes
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(str(soup))
                print(f"Processed: {file}")

if __name__ == "__main__":
    process_html_files()
    