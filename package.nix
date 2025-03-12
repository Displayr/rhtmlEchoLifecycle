{ pkgs ? import <nixpkgs> {}, displayrUtils }:

pkgs.rPackages.buildRPackage {
  name = "rhtmlEchoLifecycle";
  version = displayrUtils.extractRVersion (builtins.readFile ./DESCRIPTION); 
  src = ./.;
  description = ''An HTML widget that echoes all functon calls for debug purposes.'';
  propagatedBuildInputs = with pkgs.rPackages; [ 
    htmlwidgets
  ];
}
