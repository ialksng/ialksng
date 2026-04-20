import Project from "../projects/project.model.js"; // Assuming SmartSphere uses your Project model to group vault items

export const saveToVault = async (req, res) => {
    try {
        const { title, sourceUrl, type, projectId } = req.body;
        const userId = req.user.id || req.user._id;

        // 1. Find the user's SmartSphere project (or create a default one)
        let project = await Project.findOne({ user: userId, _id: projectId !== 'default' ? projectId : undefined });
        
        if (!project && projectId === 'default') {
            // If they don't have a default vault project yet, make one
            project = await Project.create({
                user: userId,
                title: "My Main Vault",
                description: "Default SmartSphere Knowledge Base"
            });
        }

        if (!project) {
            return res.status(404).json({ success: false, message: "Vault project not found." });
        }

        project.documents = project.documents || [];
    
        const alreadyExists = project.documents.some(doc => doc.url === sourceUrl);
        if (alreadyExists) {
            return res.status(200).json({ success: true, message: "Already in vault." });
        }

        project.documents.push({
            title: title,
            url: sourceUrl,
            type: type || 'notes',
            addedAt: new Date()
        });

        await project.save();

        res.status(200).json({ 
            success: true, 
            message: "Successfully saved to SmartSphere Vault!",
            data: project
        });

    } catch (error) {
        console.error("[SmartSphere Sync Error]:", error);
        res.status(500).json({ success: false, message: "Failed to save to vault." });
    }
};