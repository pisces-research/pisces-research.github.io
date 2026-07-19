import os
import sys
import re
from bs4 import BeautifulSoup

def process_html_files():
    # Quarto passes helpful environment variables during rendering
    output_dir = os.environ.get("QUARTO_PROJECT_OUTPUT_DIR", "_site")
    
    for root, _, files in os.walk(output_dir):
        for file in files:
            if file.endswith("publications.html"):
                file_path = os.path.join(root, file)
                
                # Read the rendered HTML
                with open(file_path, "r", encoding="utf-8") as f:
                    soup = BeautifulSoup(f.read(), "html.parser")

                # The abstract field of the bib file is put in a block with class 'csl-block'
                # Fortunately this class is not used otherwise
                abstracts = soup.find_all('div', class_='csl-block')

                # Reinstate paragraphs in the abstract
                for abs in abstracts:
                    parts = re.split(r"(?<=\w)[.](?=\w)", abs.get_text())

                    abs.clear()
                    
                    for part in parts:
                        para = soup.new_tag('p')
                        para.append(part)

                        abs.append(para)

                # Make abstracts collapsible
                for abs in abstracts:
                    contents = abs.contents[:]

                    # Create a collapsible (details) block with Abstract as the title
                    abs_collapse = soup.new_tag('details', style = 'text-indent: 0em;')
                    abs_header = soup.new_tag('summary')
                    abs_header.string = "Abstract"
                    abs_collapse.insert(0, abs_header)

                    # Put the existing contents of the csl-block into the collapsible block
                    for item in contents:
                        abs_collapse.append(item)

                    abs.clear()
                    abs.append(abs_collapse)


                # The links to the full document are better shown as icons rather than as the full URL
                links = soup.select('div.csl-entry a')

                for link in links:
                    icon = soup.new_tag('i', **{'class': 'bi bi-filetype-pdf'})

                    link.clear()
                    link.append(icon)
                    link['aria-label']='Link to document'

                    spacer = soup.new_string('\u2003')
                    link.insert_before(spacer)

                # Overwrite the file with changes
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(str(soup))
                print(f"Processed: {file}")

if __name__ == "__main__":
    process_html_files()
