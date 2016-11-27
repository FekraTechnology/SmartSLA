<#

    .SYNOPSIS 
        Stops all the Azure VMs in a specific Azure Resource Group

    .DESCRIPTION
        This sample runbooks stops all of the virtual machines in the specified Azure Resource Group. 
        For more information about how this runbook authenticates to your Azure subscription, see the
        Microsoft documentation here: http://aka.ms/fxu3mn. 

        Note: If you do not uncomment the "Select-AzureSubscription" statement (on line 57) and insert
        the name of your Azure subscription, the runbook will use the default subscription.

    .PARAMETER ResourceGroupName
        Name of the Azure Resource Group containing the VMs to be started.

    .REQUIREMENTS 
        THis runbook requires the Azure Resource Manager PowerSHell module has been imported into 
        your Azure Automation instance.

        This runbook will only return VMs deployed using the new Azure IaaS features available in the
        Azure Preview Portal and Azure Resource Manager templates. For more information, see 
        http://azure.microsoft.com/en-us/documentation/videos/build-2015-introduction-and-what-s-new-in-azure-iaas/. 
    
    .NOTES
        AUTHOR: Pete Zerger, MVP 
        LASTEDIT: May 13, 2015
#>

workflow Stop-AzureVMs
{
    
	param(

  	[string]$ResourceGroupName

 	)
	
	#The name of the Automation Credential Asset this runbook will use to authenticate to Azure.
    $CredentialAssetName = 'DefaultAzureCredential'

    #Get the credential with the above name from the Automation Asset store
    $Cred = Get-AutomationPSCredential -Name $CredentialAssetName
    if(!$Cred) {
        Throw "Could not find an Automation Credential Asset named '${CredentialAssetName}'. Make sure you have created one in this Automation Account."
    }

    #Connect to your Azure Account
    $Account = Add-AzureAccount -Credential $Cred
    if(!$Account) {
        Throw "Could not authenticate to Azure using the credential asset '${CredentialAssetName}'. Make sure the user name and password are correct."
    }
	
    #TODO (optional): pick the right subscription to use. Without this line, the default subscription for your Azure Account will be used.
    #Select-AzureSubscription -SubscriptionName "TODO: your Azure subscription name here"
	
		# Select-AzureSubscription -SubscriptionName 'FREE TRIAL'

        $VMs = AzureResourceManager\Get-AzureVM -ResourceGroupName "$ResourceGroupName"
		
    #Get all the VMs you have in your Azure subscription
    # $VMs = Get-AzureVM # | select Name, ResourceGroupName, Status, State

    #Print out up to 10 of those VMs
     if(!$VMs) {
        Write-Output "No VMs were found in your subscription."

     } else {

		Foreach -parallel ($VM in $VMs) {
		AzureResourceManager\Stop-AzureVM -ResourceGroupName "$ResourceGroupName" -Name $VM.Name -Force -ErrorAction SilentlyContinue
		}
     }
}