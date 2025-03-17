#!/bin/bash

# Verificar que el archivo remote_versions.txt exista
if [ ! -f remote_versions.txt ]; then
  echo "Error: remote_versions.txt no encontrado."
  exit 1
fi

# Función para convertir nombres de camelCase a kebab-case
to_kebab() {
  echo "$1" | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]'
}

# Iterar sobre cada directorio en components/
for dir in components/*; do
  component=$(basename "$dir")
  # Convertir el nombre a kebab-case para que coincida con el formato del paquete
  component_kebab=$(to_kebab "$component")
  pkg="@joanrojasmejia/b2b-ui-${component_kebab}"

  # Obtener la versión local desde remote_versions.txt
  version_local=$(grep "^$pkg:" remote_versions.txt | cut -d':' -f2 | tr -d '[:space:]')
  if [ -z "$version_local" ]; then
    version_local="N/A"
  fi

  # Obtener la versión publicada en el registry
  version_registry=$(npm view "$pkg" version --registry=https://npm.pkg.github.com 2>/dev/null)
  if [ -z "$version_registry" ]; then
    version_registry="N/A"
  fi

  # Imprimir el resultado en formato claro
  echo "$pkg:"
  echo "  Local: $version_local vs Registry: $version_registry"
  if [[ "$version_local" == "$version_registry" ]]; then
    echo "  ✅ Sincronizado"
  else
    echo "  ❌ Desincronizado"
  fi
  echo ""
done
