# PowerShell script to rename all jpeg files to jpg

# List of files to rename
$files = @(
    "C:\Users\sajid\Rent-Property\public\default-office.jpeg",
    "C:\Users\sajid\Rent-Property\public\location-beeston.jpeg",
    "C:\Users\sajid\Rent-Property\public\location-derby.jpeg",
    "C:\Users\sajid\Rent-Property\public\location-stapleford.jpeg",
    "C:\Users\sajid\Rent-Property\public\location-west-bridgford.jpeg",
    "C:\Users\sajid\Rent-Property\public\location-clifton.jpg",
    "C:\Users\sajid\Rent-Property\public\location-nottingham.jpg",
    "C:\Users\sajid\Rent-Property\public\location-ruddington.jpg",
    "C:\Users\sajid\Rent-Property\public\location-wilford.jpg"
)

# Verify files exist before renaming
foreach ($file in $files) {
    if (Test-Path $file) {
        # Create new filename by replacing .jpeg with .jpg
        $newName = $file -replace "\.jpeg$", ".jpg"
        
        # Rename the file
        Write-Host "Renaming $file to $newName"
        Rename-Item -Path $file -NewName $newName -Force
    } else {
        Write-Host "Warning: File not found - $file" -ForegroundColor Yellow
    }
}

Write-Host "File renaming complete!" -ForegroundColor Green