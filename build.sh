rm  ./cms-enterprise.zip
rm  ./cms-professional.zip
rm  ./cms-standard.zip
/usr/local/bin/ruby cms-build.rb
zip -r cms-enterprise cms-enterprise
zip -r cms-professional cms-professional
zip -r cms-standard cms-standard