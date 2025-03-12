export function parseIDL(idl: any) {
    if (!idl || typeof idl !== "object") {
      throw new Error("Invalid IDL format");
    }
  
    return {
      programAddress: idl.address,
      name: idl.metadata?.name || "Unknown Program",
      version: idl.metadata?.version || "N/A",
      description: idl.metadata?.description || "No description available",
  
      instructions: idl.instructions.map((inst: any) => ({
        name: inst.name,
        discriminator: inst.discriminator,
        accounts: inst.accounts.map((acc: any) => ({
          name: acc.name,
          writable: acc.writable || false,
          signer: acc.signer || false,
          pda: acc.pda ? acc.pda.seeds.map((seed: any) => seed.kind) : null,
        })),
        args: inst.args.map((arg: any) => ({
          name: arg.name,
          type: arg.type,
        })),
      })),
  
      accounts: idl.accounts?.map((acc: any) => ({
        name: acc.name,
        discriminator: acc.discriminator,
      })) || [],
  
      pdas: idl.instructions.flatMap((inst: any) =>
        inst.accounts
          .filter((acc: any) => acc.pda)
          .map((acc: any) => ({
            name: acc.name,
            seeds: acc.pda.seeds.map((seed: any) => seed.kind),
          }))
      ),
  
      systemPrograms: idl.instructions.flatMap((inst: any) =>
        inst.accounts.filter((acc: any) => acc.address).map((acc: any) => acc.address)
      ),
    };
  }
  